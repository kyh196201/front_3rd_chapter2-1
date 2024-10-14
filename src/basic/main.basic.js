// 상수 변수
const LOYALTY_POINT_RATE = 0.001;

let prodList;
let $productSelect;
let $addButton;
let $cartItems;
let $cartTotal;
let $stockStatus;
let lastAddedProductId = null;
let loyaltyPoints = 0;
let totalAmt = 0;
let itemCnt = 0;

function main() {
  // 상품 리스트 초기화
  prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  // 엘리먼트 생성 및 초기화
  const $root = document.getElementById('app');

  // 장바구니 페이지
  const $cart = document.createElement('div');
  $cart.id = 'cart';
  $cart.className = 'bg-gray-100 p-8';

  // 장바구니 페이지 inner
  const $cartInner = document.createElement('div');
  $cartInner.id = 'cart-inner';
  $cartInner.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  // 페이지 제목
  const $title = document.createElement('h1');
  $title.className = 'text-2xl font-bold mb-4';
  $title.textContent = '장바구니';

  // 장바구니에 담긴 상품 리스트
  $cartItems = document.createElement('div');
  $cartItems.id = 'cart-items';

  // 장바구니 총액
  $cartTotal = document.createElement('div');
  $cartTotal.id = 'cart-total';
  $cartTotal.className = 'text-xl font-bold my-4';

  // 상품 리스트
  $productSelect = document.createElement('select');
  $productSelect.id = 'product-select';
  $productSelect.className = 'border rounded p-2 mr-2';

  // 상품 추가 버튼
  $addButton = document.createElement('button');
  $addButton.id = 'add-to-cart';
  $addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $addButton.textContent = '추가';

  // 상품 재고 상태 문구
  $stockStatus = document.createElement('div');
  $stockStatus.id = 'stock-status';
  $stockStatus.className = 'text-sm text-gray-500 mt-2';

  $cartInner.appendChild($title);
  $cartInner.appendChild($cartItems);
  $cartInner.appendChild($cartTotal);
  $cartInner.appendChild($productSelect);
  $cartInner.appendChild($addButton);
  $cartInner.appendChild($stockStatus);

  $cart.appendChild($cartInner);

  $root.appendChild($cart);

  renderProductSelect();
  calcCart();

  // 30초 마다 무작위로 상품을 하나 선택하고, 30%의 확률로 20% 할인을 적용
  setTimeout(function () {
    setInterval(function () {
      const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        renderProductSelect();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 장바구니에 마지막으로 추가된 상품을 제외하고, 무작위로 상품을 하나 선택해서 5% 할인을 적용
  setTimeout(function () {
    setInterval(function () {
      if (lastAddedProductId !== null) {
        const suggest = prodList.find(function (item) {
          return item.id !== lastAddedProductId && item.q > 0;
        });
        if (suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.val = Math.round(suggest.val * 0.95);
          renderProductSelect();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

/**
 * 상품 선택 셀렉트박스를 렌더링
 */
function renderProductSelect() {
  $productSelect.innerHTML = '';

  prodList.forEach((product) => {
    const opt = document.createElement('option');

    opt.value = product.id;
    opt.textContent = `${product.name} - ${product.val}원`;

    // 재고가 없을 경우 비활성화
    if (product.q === 0) opt.disabled = true;

    $productSelect.appendChild(opt);
  });
}

function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  const cartItems = $cartItems.children;
  let subTot = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }

      const q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      const itemTot = curItem.val * q;
      let disc = 0;
      itemCnt += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCnt >= 30) {
    const bulkDisc = totalAmt * 0.25;
    const itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  $cartTotal.textContent = `총액: ${Math.round(totalAmt)}원`;
  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discRate * 100).toFixed(1)}% 할인 적용)`;
    $cartTotal.appendChild(span);
  }
  renderStockStatus();

  // 장바구니에 담긴 상품 금액을 기준으로 포인트 업데이트
  const newLoyaltyPoints = calcLoyaltyPoints(loyaltyPoints, totalAmt);
  renderLoyaltyPoints(newLoyaltyPoints);
  loyaltyPoints = newLoyaltyPoints;
}

/**
 * 현재 장바구니에 담긴 상품의 총 합을 기준으로 포인트를 계산합니다
 * @param {number} currentPoints - 현재 누적된 포인트
 * @param {number} cartTotal - 장바구니에 담긴 상품의 총 합
 * @returns {number} 계산된 포인트
 */
function calcLoyaltyPoints(currentPoints = 0, cartTotal = 0) {
  return currentPoints + Math.floor(cartTotal * LOYALTY_POINT_RATE);
}

/**
 * 장바구니에 담긴 상품의 총 금액을 기준으로 포인트를 계산하고, 렌더링
 */
function renderLoyaltyPoints(points) {
  let $el = document.getElementById('loyalty-points');
  if (!$el) {
    $el = document.createElement('span');
    $el.id = 'loyalty-points';
    $el.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild($el);
  }

  $el.textContent = `(포인트: ${points})`;
}

function renderStockStatus() {
  $stockStatus.textContent = prodList
    .filter(({ q }) => q < 5)
    .map(({ q, name }) => {
      return `${name}: ${q > 0 ? `재고 부족 (${q}개 남음)` : '품절'}`;
    })
    .join('\n');
}

main();

$addButton.addEventListener('click', function () {
  const selItem = $productSelect.value;
  const itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });

  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd.id);
    // 장바구니에 상품이 추가되어 있을 경우
    if (item) {
      const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent = `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 장바구니에 상품을 새로 추가할 경우
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        `<span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span><div>` +
        `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
          itemToAdd.id
        }" data-change="-1">-</button>` +
        `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
          itemToAdd.id
        }" data-change="1">+</button>` +
        `<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${
          itemToAdd.id
        }">삭제</button></div>`;
      $cartItems.appendChild(newItem);
      itemToAdd.q--;
    }

    calcCart();

    // 마지막에 장바구니에 담은 상품 저장
    lastAddedProductId = selItem;
  }
});

$cartItems.addEventListener('click', function (event) {
  const tgt = event.target;

  // 수량 증가 또는 감소
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = prodList.find(function (p) {
      return p.id === prodId;
    });

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (newQty > 0 && newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent =
          `${itemElem.querySelector('span').textContent.split('x ')[0]}x ${newQty}`;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.q += remQty;
      itemElem.remove();
    }

    calcCart();
  }
});
