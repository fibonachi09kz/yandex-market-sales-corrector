let changeColor = document.getElementById("saleCalcBtn");
let promoActivate = document.getElementById("promoCalcBtn");


changeColor.addEventListener("click", async (e) => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: promoAI
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






function promoAI() {
	let table = document.querySelector('table');
	let checkbox = table.querySelector('thead input[type="checkbox"]');
	const isNumeric = n => !!Number(n);
	let baseSaleValue = document.querySelector('[data-e2e-i18n-key="pages.fulfillment-promos:promo.feature.discount-categories"]').textContent
	baseSaleValue = baseSaleValue.split('').filter((e) => isNumeric(e));
	baseSaleValue = `${baseSaleValue[0]}${baseSaleValue[1]}`

	class dynamicTimer {
		constructor(func, delay) {
			this.callback = func
			this.triggerTime = delay
			this.timer = 0
			this.updateTimer()
		}
		updateTimer() {
			clearTimeout(this.timer)
			let delay = this.triggerTime
			console.log('таймер обновлён')
			this.timer = setTimeout(this.callback, delay)
			return this
		}
		addTime(delay) {
			this.triggerTime = delay
			this.updateTimer()
			return this
		}
		clear() {
			clearTimeout(this.timer)
		}
	}
	
	let observer = new MutationObserver((mutationsList) => {
		
		for (let mutation of mutationsList) {
			if (mutation.type === 'childList' && mutation.target.classList.contains('___root_k72io_1')) {
				saleAlertCorrect(mutation.target)
			}
			if (mutation.type === 'characterData' && mutation.target.parentElement.classList.contains('___Tag___xFCxD')) {
				incorrectedSaleDeclick(mutation.target)
			}
        }

		timer.updateTimer()
		
	});

	
	observer.observe(table, {childList: true, subtree: true, characterData: true, attributes: true});

	checkbox.click();
	let timer = new dynamicTimer(nextPage, 3000)

	function saleAlertCorrect(node) {
		let btn = node.querySelector('button.___Clickable___fcJVD');
		if (btn) btn.click()
	}

	function incorrectedSaleDeclick(node) {
		if (parseInt(node.data) != Number(baseSaleValue)) {
			let check = node.parentElement.closest('tr').querySelector('input[type="checkbox"]');
			if (check.checked) {
				check.click()
			}
		}
	}
 

	
	function nextPage() {
		let btn = document.querySelector('.__use--size___TJHkL.__use--size_s___vC9Zt .___Button___Ltx4B.__use--type___HP3kV.__use--type_page___a18Cq.__disabled___IQ_Hz');
		let nextPage = btn.nextElementSibling;
		let pageCon = nextPage.querySelector('span span')?.textContent
	
		if (pageCon) {
			nextPage.click()
			console.log('работы заверешены')
		} else {
			observer.disconnect()
			tableChanger.disconnect()
		}
	}

	let counter = 0

	let tableChangerIndicator = document.querySelector('[data-e2e="table-preloader"]')

	let tableChanger = new MutationObserver((mutationsList) => {
		for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
				retry()
			}
        }
	});

	
	tableChanger.observe(tableChangerIndicator, {childList: false, subtree: false, characterData: true, attributes: true});

	function retry() {
		counter++
		if (counter % 2 === 0) {
			auto()
		}
	}
	
	
	function auto() {
		checkbox.click()
		timer = new dynamicTimer(nextPage, 3000)
	}













	document.addEventListener('keydown', (e) => {
		if ( e.key === 'ArrowDown' ) {
			observer.disconnect()
			tableChanger.disconnect()
			alert('Автоматизация завершена')
		}
	})

}




















































function promoCalc() {
	
	let checkAll = document.querySelector('table thead input[type="checkbox"]');

	const delay = (n) => {
		return new Promise (res => {
			let tm = setTimeout (() => res(tm), n);
		})
	}

	let errorObserver;
	let errorTimeout;
	const errorCleanup = () => {
		clearTimeout(errorTimeout);
		errorObserver.disconnect();
	};
	function checkErrors() {
		const tableRows = document.querySelectorAll('table tbody tr');
		tableRows.forEach((row) => {
			let check = row.querySelector('input[type="checkbox"]');
			let error = row.querySelector('td:nth-child(8) .___unit_k72io_1 div');
			if (error) {
				check.click()
			}
		})
		errorCleanup()
	}
	async function checkErrorInRow() {
		try {
			const element = await monitorElements('tr td:nth-child(8) .___unit_k72io_1 div');
			console.log('error found', element)
			checkErrors()
		} catch (error) {
			console.error(error);
		}
	}
	async function monitorElements(selector) {
		return new Promise((resolve, reject) => {
			errorObserver = new MutationObserver((mutationsList) => {
				for (let mutation of mutationsList) {
					for (let addedNode of mutation.addedNodes) {
						if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.matches(selector)) {
							resolve(addedNode);
							return;
						}
					}
				}
			});
	
			errorObserver.observe(document.documentElement, { childList: true, subtree: true });
	
			const existingElement = document.querySelector(selector);
			if (existingElement) {
				resolve(existingElement);
				return;
			}
	
			errorTimeout = setTimeout(() => {
				errorObserver.disconnect();
				reject(new Error(`Timed out waiting for element matching selector '${selector}'`));
			}, 10000);
	
			const cleanup = () => {
				clearTimeout(errorTimeout);
				errorObserver.disconnect();
			};
			
			return cleanup;
		});
	}


	
	
	

	checkAll.addEventListener('change', function() {
		promo();
	})

	const promo = async (tableRs) => {
		checkAll.click()
		await delay(100);

		await checkErrorInRow();

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
	const nativeInput = new Event('input', { bubbles: true });
	const nativeClick = new Event('click', { bubbles: true });
	const nativeFocus = new FocusEvent('focus');
	const nativeBlur = new FocusEvent('blur');

	function firstInputChange(inputF, price) {
		nativeInputValueSetter.call(inputF, price);
		inputF.dispatchEvent(nativeInput);
		inputF.dispatchEvent(nativeFocus);
		inputF.dispatchEvent(nativeBlur);
	}
	function zeroSetter(inputS) {
		nativeInputValueSetter.call(inputS, '');
		inputS.dispatchEvent(nativeInput);
		inputS.dispatchEvent(nativeFocus);
		inputS.dispatchEvent(nativeBlur);
	}

	function checkboxSetter(checkboxElem, status) {
		nativeCheckboxValueSetter.call(checkboxElem, status);
		checkboxElem.dispatchEvent(nativeClick);
	}

	function nexter() {
		let btn = document.querySelector('.__use--size___TJHkL.__use--size_s___vC9Zt .___Button___Ltx4B.__use--type___HP3kV.__use--type_page___a18Cq.__disabled___IQ_Hz').nextElementSibling;

		let pageCon = btn.querySelector('span span')?.textContent

		if (pageCon) {
			btn.click()
		} else {
			observer.disconnect()
		}
	}


	const tableRows = document.querySelectorAll('table tbody tr');
	const checkAllBtn = document.querySelector('table thead [type="checkbox"]');
        
	const fd = async (tableRs) => {

		for ( const rowOne of tableRs) {

			rowOne.style.backgroundColor = '#d4e3fa';

			/////////////////////////////////////////////////////////////////////
			let checkbox = rowOne.querySelector('[type="checkbox"]'),
			inputFirst = rowOne.querySelectorAll('td')[6].querySelector('input'),
			price = rowOne.querySelectorAll('td')[5].querySelector('span.___Tag___xFCxD.__use--kind___TqC3g.__use--kind_tableBody____vp1n'),
			sale = rowOne.querySelectorAll('td')[8].querySelector('span.___Tag___xFCxD.__use--kind___TqC3g.__use--kind_tableBody____vp1n');
			/////////////////////////////////////////////////////////////////////


			let priceTxt = price.textContent;
			priceTxt = priceTxt.replace(/\D/g,'');
			let saleTxt = sale.textContent;
			saleTxt = saleTxt.replace(/\D/g,'');
			let checkboxStatus = checkbox.checked


			if (checkboxStatus === false && saleTxt != 0) {
				checkboxSetter(checkbox, true)
			}



			function inputter() {
				firstInputChange(inputFirst, priceTxt)
				if (inputFirst.value > price) inputter()
			}
			inputter()

			await delay(10)
			
		}

		for ( const rowTwo of tableRs) {

			rowTwo.style.backgroundColor = '#dff4d9';

			/////////////////////////////////////////////////////////////////////
			let inputSecond = rowTwo.querySelectorAll('td')[7].querySelector('input');

			zeroSetter(inputSecond)
			
			await delay(100)
			
		}

		


	}

	checkAllBtn.addEventListener('click', function() {
		fd(tableRows).then(r => nexter())
	})

	let counter = 0

	let data = document.querySelector('[data-e2e="table-preloader"]')

	let observer = new MutationObserver((mutationsList) => {
		for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
				counter++
				if (counter % 2 == 0) {
					fd(tableRows).then(r => nexter())
				}
			}
        }
	});
	
	observer.observe(data, {childList: false, subtree: false, characterData: true, attributes: true});

	fd(tableRows).then(r => nexter())
    
}