
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

	let checkAll = document.querySelector('.___thead___FJGT0 input[type="checkbox"]');

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

	let data = document.querySelector('table')

	let observer = new MutationObserver(() => retry());

	
	observer.observe(data, {childList: true, subtree: true});

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
			observer.observe(data, {childList: true, subtree: true});
			alert('Автоматизация включена! Нажмите кнопку выделения всех товаров!')
		}
	})

}


function saleCalc() {

    // Получаем кнопку отметить всё
    let checkAll = document.querySelector('.___thead___FJGT0 input[type="checkbox"]');

	const delay = (n) => {
		return new Promise (res => {
			let tm = setTimeout (() => res(tm), n);
		})
	}

	checkAll.addEventListener('change', function() {
		let tableRows = document.querySelectorAll('table.___table___I4N5X tbody tr');
		fd(tableRows);
	})
        
	const fd = async (tableRs) => {

		for ( const e of tableRs) {

			e.style.backgroundColor = '#d4e3fa';

			let checkbox = e.querySelector('[type="checkbox"]'),
				fields = e.querySelectorAll('span.___Tag___xFCxD.__use--kind___TqC3g.__use--kind_tableBody____vp1n'),
				inputs = e.querySelectorAll('.___Input___oH1gz.__type___n5hUm.__type_number___h9Hom.__use--align___Ct2J1.__use--align_left___u50gM'),
				
				inputFirst = inputs[0],
				inputSecond = inputs[1],

				price = fields[1],
				sale = fields[2];

			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

			let priceTxt = price.textContent;
			priceTxt = priceTxt.replace(/\D/g,'');

			let checkboxStatus = checkbox.checked

			function firstInputChange() {
				nativeInputValueSetter.call(inputFirst, priceTxt);
				var ev = new Event('input', { bubbles: true});
				inputFirst.dispatchEvent(ev);
				var focus = new FocusEvent('focus')
				var blur = new FocusEvent('blur')
				inputFirst.dispatchEvent(focus);
				inputFirst.dispatchEvent(blur);
			}
			firstInputChange();

			function zeroSetter() {
				nativeInputValueSetter.call(inputSecond, '');
				var ev = new Event('input', { bubbles: true});
				inputSecond.dispatchEvent(ev);
				var focus = new FocusEvent('focus')
				var blur = new FocusEvent('blur')
				inputSecond.dispatchEvent(focus);
				inputSecond.dispatchEvent(blur);
			}
			function zeroChecker() {
				let saleTxt = sale.textContent;
				saleTxt = saleTxt.replace(/\D/g,'');

				if (saleTxt == 0) {
					e.style.backgroundColor = "#fad5d4"
					if (checkboxStatus) {
						checkbox.click()
					}
				} else {
					e.style.backgroundColor = "#d4fae0"
				}
			}
			await delay(50);
			zeroSetter()
			await delay(50);
			zeroChecker()
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

	let data = document.querySelector('table')

	let observer = new MutationObserver(() => retry());

	
	observer.observe(data, {childList: true, subtree: true});

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
			observer.observe(data, {childList: true, subtree: true});
			alert('Автоматизация включена! Нажмите кнопку выделения всех товаров!')
		}
	})
    
}
