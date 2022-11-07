let changeColor = document.getElementById("saleCalcBtn");
let promoActivate = document.getElementById("promoCalcBtn");


changeColor.addEventListener("click", async (e) => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: saleCalc
	});

	e.target.textContent = "Готово!";

	function textClear() {
		e.target.textContent = "Активировать акции"
	}
	setTimeout(textClear, 1000);
});


promoActivate.addEventListener("click", async (e) => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: promoCalc
	});

	e.target.textContent = "Готово!";

	function textClear() {
		e.target.textContent = "Активировать промокоды"
	}
	setTimeout(textClear, 1000);
});



function promoCalc() {

	let checkAll = document.querySelector('table thead input[type="checkbox"]');

	const delay = (n) => {
		return new Promise (res => {
			let tm = setTimeout (() => res(tm), n);
		})
	}

	checkAll.addEventListener('change', function() {
		promo();
	})

	const promo = async (tableRs) => {
		checkAll.click()
		await delay(100);
		let btn = document.querySelector('.__use--size___TJHkL.__use--size_s___vC9Zt .___Button___Ltx4B.__use--type___HP3kV.__use--type_page___a18Cq.__disabled___IQ_Hz');
		let nextPage = btn.nextElementSibling;
		let pageCon = nextPage.querySelector('span span')?.textContent

		if (pageCon) {
			nextPage.click()
		} else {
			observer.disconnect()
		}
	}

	checkAll.click()

	let counter = 0

	let data = document.querySelector('[data-e2e="table-preloader"]')

	let observer = new MutationObserver((mutationsList) => {
		for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
				retry()
				break
			}
        }
	});

	
	observer.observe(data, {childList: false, subtree: false, characterData: true, attributes: true});

	function retry() {
		counter++
		if (counter % 2 == 0) {
			auto()
		}
	}

	
	function auto() {
		checkAll.click()
	}


	document.addEventListener('keydown', (e) => {
		if ( e.key == 'ArrowDown' ) {
			observer.disconnect()
			alert('Автоматизация завершена')
		} else if ( e.key == 'ArrowUp' ) {
			observer.observe(data, {childList: false, subtree: false, characterData: true, attributes: true});
			alert('Автоматизация включена! Нажмите кнопку выделения всех товаров!')
		}
	})

}


function saleCalc() {

    // Получаем кнопку отметить всё
    let checkAll = document.querySelector('table thead input[type="checkbox"]');


	// Следим за нажатием по кнопке отметить всё
	checkAll.addEventListener('change', function() {
		// Получаем все строки таблицы
		let tableRows = document.querySelectorAll('table tbody tr');
		// Запускаем главную функцию перебора
		fd(tableRows)
	})


	const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

	const delay = (n) => {
		return new Promise (res => {
			let tm = setTimeout (() => res(tm), n);
		})
	}

	function firstInputChange(inputF, price) {
		nativeInputValueSetter.call(inputF, price);
		let ev = new Event('input', { bubbles: true});
		inputF.dispatchEvent(ev);
		let focus = new FocusEvent('focus')
		let blur = new FocusEvent('blur')
		inputF.dispatchEvent(focus);
		inputF.dispatchEvent(blur);
	}
	function zeroSetter(inputS) {
		nativeInputValueSetter.call(inputS, '');
		let ev = new Event('input', { bubbles: true});
		inputS.dispatchEvent(ev);
		let focus = new FocusEvent('focus')
		let blur = new FocusEvent('blur')
		inputS.dispatchEvent(focus);
		inputS.dispatchEvent(blur);
	}
        
	const fd = async (tableRs) => {

		for ( const row of tableRs) {

			row.style.backgroundColor = '#d4e3fa';

			let checkbox = row.querySelector('[type="checkbox"]'), //Получаем галочку
				inputFirst = row.querySelectorAll('td')[6].querySelector('input'), //Получаем первое поле ввода в строке
				inputSecond = row.querySelectorAll('td')[7].querySelector('input'), //Получаем второе поле ввода в строке
				price = row.querySelectorAll('td')[5].querySelector('span.___Tag___xFCxD.__use--kind___TqC3g.__use--kind_tableBody____vp1n'), //Получаем основную цену
				sale = row.querySelectorAll('td')[8].querySelector('span.___Tag___xFCxD.__use--kind___TqC3g.__use--kind_tableBody____vp1n'); //Получаем процент скидки
			
			let priceTxt = price.textContent;
			priceTxt = priceTxt.replace(/\D/g,'');
			let checkboxStatus = checkbox.checked
			
			firstInputChange(inputFirst, priceTxt);
			await delay(200);
			zeroSetter(inputSecond)
			await delay(200);
			
			let saleTxt = sale.textContent;
			saleTxt = saleTxt.replace(/\D/g,'');

			if (saleTxt == 0) {
				row.style.backgroundColor = "#fad5d4"
				if (checkboxStatus) {
					checkbox.click()
				}
			} else {
				row.style.backgroundColor = "#d4fae0"
			}
			
		}
		let btn = document.querySelector('.__use--size___TJHkL.__use--size_s___vC9Zt .___Button___Ltx4B.__use--type___HP3kV.__use--type_page___a18Cq.__disabled___IQ_Hz');
	
		let nextPage = btn.nextElementSibling;
	
		let pageCon = nextPage.querySelector('span span')?.textContent

		if (pageCon) {
			nextPage.click()
		} else {
			observer.disconnect()
		}
	}

	checkAll.click()

	let counter = 0

	let data = document.querySelector('[data-e2e="table-preloader"]')

	let observer = new MutationObserver((mutationsList) => {
		for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
				retry()
				break
			}
        }
	});

	
	observer.observe(data, {childList: false, subtree: false, characterData: true, attributes: true});

	function retry() {
		counter++
		if (counter % 2 == 0) {
			auto()
		}
	}

	function auto() {
		checkAll.click()
	}


	document.addEventListener('keydown', (e) => {
		if ( e.key == 'ArrowDown' ) {
			observer.disconnect()
			alert('Автоматизация завершена')
		} else if ( e.key == 'ArrowUp' ) {
			observer.observe(data, {childList: false, subtree: false, characterData: true, attributes: true});
			alert('Автоматизация включена! Нажмите кнопку выделения всех товаров!')
		}
	})
    
}