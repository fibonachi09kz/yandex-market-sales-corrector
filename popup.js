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
		if (counter % 2 === 0) {
			auto()
		}
	}

	
	function auto() {
		checkAll.click()
	}


	document.addEventListener('keydown', (e) => {
		if ( e.key === 'ArrowDown' ) {
			observer.disconnect()
			alert('Автоматизация завершена')
		} else if ( e.key === 'ArrowUp' ) {
			observer.observe(data, {childList: false, subtree: false, characterData: true, attributes: true});
			alert('Автоматизация включена! Нажмите кнопку выделения всех товаров!')
		}
	})

}




















function saleCalc() {


	
	const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
	const nativeCheckboxValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "checked").set;
	const delay = (n) => {
		return new Promise (res => {
			let tm = setTimeout (() => res(tm), n);
		})
	}
	const ev = new Event('input', { bubbles: true});

	function nativeClick(elem) {
		elem.dispatchEvent(new Event('click', { bubbles: true }));
	}

	function nativeDetect(event, elem) {
		elem.dispatchEvent(ev);
		let focus = new FocusEvent('focus')
		let blur = new FocusEvent('blur')
		elem.dispatchEvent(focus);
		elem.dispatchEvent(blur);
	}
	function firstInputChange(inputF, price) {
		nativeInputValueSetter.call(inputF, price);
		nativeDetect(ev, inputF)
	}
	function zeroSetter(inputS) {
		nativeInputValueSetter.call(inputS, '');
		nativeDetect(ev, inputS)
	}



	function checkboxSetter(checkboxElem, status) {
		nativeCheckboxValueSetter.call(checkboxElem, status);
		checkboxElem.dispatchEvent(new Event('click', { bubbles: true }));
	}


	const tableRows = document.querySelectorAll('table tbody tr');
	const checkAllBtn = document.querySelector('table thead [type="checkbox"]');
        
	const fd = (tableRs) => {

		for ( const row of tableRs) {

			/////////////////////////////////////////////////////////////////////
			let checkbox = row.querySelector('[type="checkbox"]'),
			inputFirst = row.querySelectorAll('td')[6].querySelector('input'),
			inputSecond = row.querySelectorAll('td')[7].querySelector('input'),
			price = row.querySelectorAll('td')[5].querySelector('span.___Tag___xFCxD.__use--kind___TqC3g.__use--kind_tableBody____vp1n'),
			sale = row.querySelectorAll('td')[8].querySelector('span.___Tag___xFCxD.__use--kind___TqC3g.__use--kind_tableBody____vp1n');
			/////////////////////////////////////////////////////////////////////



			// Запускаем обсервер для первого инпута
			/////////////////////////////////////////////////////////////////////
			let inputFirstObserver = new MutationObserver((mutationsList) => {
				if (inputFirst.value <= price) {
					zeroSetter(inputSecond)
				}
			});
			inputFirstObserver.observe(inputFirst, {
				attributes: true,
				characterData: true
			});
			/////////////////////////////////////////////////////////////////////



			// Запускаем обсервер для второго инпута
			/////////////////////////////////////////////////////////////////////
			let inputSecondObserver = new MutationObserver((mutationsList) => {
				
			});
			inputSecondObserver.observe(inputSecond, {
				attributes: true
			});
			/////////////////////////////////////////////////////////////////////



			/////////////////////////////////////////////////////////////////////
			let priceTxt = price.textContent;
			priceTxt = priceTxt.replace(/\D/g,'');
			let saleTxt = sale.textContent;
			saleTxt = saleTxt.replace(/\D/g,'');
			let checkboxStatus = checkbox.checked


			if (checkboxStatus === false && saleTxt != 0) {
				checkboxSetter(checkbox, true)
			}
			firstInputChange(inputFirst, priceTxt)
			/////////////////////////////////////////////////////////////////////
			
			
		}
		let btn = document.querySelector('.__use--size___TJHkL.__use--size_s___vC9Zt .___Button___Ltx4B.__use--type___HP3kV.__use--type_page___a18Cq.__disabled___IQ_Hz').nextElementSibling;
	
		let pageCon = btn.querySelector('span span')?.textContent

		if (pageCon) {
			nativeClick(btn)
		} else {
			observer.disconnect()
		}
	}

	checkAllBtn.addEventListener('click', function() {
		fd(tableRows)
	})

	let data = document.querySelector('[data-e2e="table-preloader"]')

	let observer = new MutationObserver((mutationsList) => {
		for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
				fd(tableRows)
				break
			}
        }
	});
	
	observer.observe(data, {childList: false, subtree: false, characterData: true, attributes: true});

	fd(tableRows)
    
}