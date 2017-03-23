# rotary-draw

var x = new createRound(obj,{
		data: data
	});

参数：
	obj : 在该元素下创建添加canvas
	json:{
		width : canvas画布宽度，没有值默认为800,
		height : canvas画布高度，没有值默认为600,
		cx : 转盘中心x位置,没有值默认为画布宽度一半,
		cy : 转盘中心y位置，没有值默认为画布高度一半,
		r : 转盘半径，默认为250,
		bgColor : 转盘边框颜色，默认为‘#a00’,
		start : 转盘起始角度，默认为0,
		end : 转盘结束角度，默认为360,
		mR : 转盘中心圆背景颜色，默认为’#a00,
		mS : 转盘中心小圆背景颜色，默认为’#ee0‘,
		data : data（必填）
	}

data 数据：
	
	data = [
		{name:'xxxx',color:'#ff0',id:'x'},
		{name:'xxxx',color:'#ff0',id:'x'},
		...
	];


用户触发事件时调用方法：

	r.pointerMove(目标奖项id);


	示例：

	oBtn.onclick = function()
	{
		var data2 = {id:'i'};
		r.pointerMove(data2.id);
	};
