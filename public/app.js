
const getData = function(callback){
	fetch('./data/data.json').then(d=>{
		return d.json()
	}).then(data=>{
		callback(data)
	})
}

const genTableArr = function(data){
	let arr = []

	const formatMoney = function(int){
		return +(int/100).toFixed(2)
	}

	for(var k in data){
		const check  = data[k]
		const market = check.user.split('  ').join('')
		const date   = new Date(check.dateTime*1000).toLocaleDateString()

		for(var j in check.items){
			const item = check.items[j]

			arr.push({
				// timestamp : check.dateTime,
				date      : date,
				market    : market,		
				name      : item.name,
				price     : formatMoney(item.price),
				quantity  : item.quantity,
				sum       : formatMoney(item.sum),
			})
		}
	}

	return arr 
}


const calcStat = function(items){
	let stat = {
		groupedItems:{},
		total:{ sum:0, items:0 },
		maxSum:0, maxPrice:0
	}

	items.forEach(item=>{
		stat.total.sum   += item.sum*1
		stat.total.items += item.quantity*1

		if (stat.maxPrice < item.price) stat.maxPrice = item.price
		if (stat.maxSum < item.sum)     stat.maxSum   = item.sum

		if(!stat.groupedItems[item.name]) {
			stat.groupedItems[item.name] = {
				name     : item.name,
				quantity : 0,
				sum      : 0,
			}
		}
		let gi = stat.groupedItems[item.name]

		gi.quantity += item.quantity
		gi.sum      += item.sum
	})


	stat.groupedItems = Object.values(stat.groupedItems).sort(function compare(a, b) {
		if (a.sum > b.sum) return -1		
		return 1
	})

	return stat
}	

const renderTable = function(items, name){
	let table = ''
	let thead = '<tr><th>'+Object.keys(items[0]).join('</th><th>')+'</th></tr>'
	let tbody = ''

	items.forEach(item=>{
		tbody += '<tr><td>'+Object.values(item).join('</td><td>')+'</td></tr>'
	})

	table = `<table>
		<caption>${name}</caption>
		<thead>${thead}</thead>
		<tbody>${tbody}</tbody>
	</table>`

	return table
}



getData(data=>{
	const items = genTableArr(data)
	const stat  = calcStat(items)

	document.getElementById('stat').innerHTML = renderTable([{
		checks      : data.length,
		sum      : stat.total.sum,
		items    : stat.total.items,
		maxPrice : stat.maxPrice,
	}], 'Stat')

	document.getElementById('grouped').innerHTML = renderTable(stat.groupedItems, 'Grouped Items')
	document.getElementById('all').innerHTML     = renderTable(items, 'All items')
})



