// 角度转弧度
function d2a(n)
{
	return n * Math.PI / 180;
};
function a2d()
{
	return n * 180 / Math.PI;
};
function rnd(n,m){
	return parseInt(Math.random()*(m-n))+n;
};
function createRound(obj,config)
{
	var oBox = document.querySelector(obj);
	this.oC = document.createElement('canvas');

	this.config = config || {};
	this.config.width = this.config.width || 800;
	this.config.height = this.config.height || 600;
	this.config.cx = this.config.cx || this.config.width/2;
	this.config.cy = this.config.cy || this.config.height/2;
	this.config.r = this.config.r || 250;
	this.config.bgColor = this.config.bgColor || '#a00';
	this.config.start = this.config.start || 0;
	this.config.end = this.config.end || 360;
	this.config.data = this.config.data || [];
	this.config.mR = this.config.mR || '#a00';
	this.config.sR = this.config.sR || '#ee0';

	this.oC.width = this.config.width;
	this.oC.height = this.config.height;

	oBox.appendChild(this.oC);

	this.gd = this.oC.getContext('2d');

	this.init();
};
createRound.prototype.init = function()
{

	if(!this.config.data || this.config.data.length == 0)
	{
		alert("奖品信息加载失败");
		return;
	}

	// 指针绘制
	this.pointer();

	// 转盘边框
	this.drow(this.config.r+10,this.config.start,this.config.end,this.config.bgColor);
	// 转盘分块
	this.moreBlock(this.config.data);

	// 转盘内文字填写
	this.drowTextM();

	// 转盘中心的两个小圆
	this.drow(20,this.config.start,this.config.end,this.config.mR);
	this.drow(10,this.config.start,this.config.end,this.config.sR);

};

// 画弧
createRound.prototype.drow = function(r,a,b,c)
{
	this.gd.save();
	this.gd.beginPath();

	this.gd.moveTo(this.config.cx,this.config.cy);


	this.gd.arc(this.config.cx,
	this.config.cy,
	r,
	d2a(a),
	d2a(b));


	this.gd.fillStyle = c;
	this.gd.fill();

	this.gd.closePath();
	this.gd.restore();	
}

// 分块
createRound.prototype.moreBlock = function(arr)
{

	this.config.pyl = 90+180/arr.length;

	for(var i=0; i<arr.length; i++)
	{

		var c = arr[i].color;
		var a = 360/arr.length*i-this.config.pyl;
		var b = 360/arr.length*(i+1)-this.config.pyl;

		arr[i].start = a+90+90/arr.length;
		arr[i].end = b+90-90/arr.length;

		this.drow(this.config.r,a,b,c);
	}
}

// 绘制指针默认状态
createRound.prototype.pointer = function()
{

	var cx = this.config.cx;
	var cy = this.config.cy;

	var arr = [
		{x:cx-5,y:cy-200},
		{x:cx-15,y:cy-195},
		{x:cx,y:cy-220},
		{x:cx+15,y:cy-195},
		{x:cx+5,y:cy-200},
		{x:cx+5,y:cy}
	];

	this.gd.save();
	this.gd.beginPath();

	this.gd.moveTo(cx-5,cy);

	for(var i=0; i<arr.length; i++)
	{
		this.gd.lineTo(arr[i].x,arr[i].y);
	}

	this.gd.shadowOffsetX=2;
	this.gd.shadowOffsetY=2;
	this.gd.shadowBlur=10;
    this.gd.shadowColor='#666';

	this.gd.fillStyle = '#a00';
	this.gd.fill();

	this.gd.closePath();
	this.gd.restore();

	var str = this.oC.toDataURL('img/p.png');
	this.oImg=new Image();

	var _this = this;

	this.oImg.onload=function()
	{
		_this.clearOther(0);	
	};

	this.oImg.src = str;

}

// 保留指针，清空其他
createRound.prototype.clearOther = function(t)
{
	// 清空画布
	this.gd.clearRect(0,0,this.oC.width,this.oC.height);

	// 重绘背景圆盘
	this.drow(this.config.r+10,this.config.start,this.config.end,this.config.bgColor);
	// 重绘分块圆盘
	this.moreBlock(this.config.data);

	// 重绘文字
	this.drowTextM();


	// 指针
	this.xpos = this.oC.width/2;
	this.ypos = this.oC.height/2;
	this.gd.save();

	this.gd.translate(this.xpos,this.ypos);
	this.gd.rotate(d2a(t));
	this.gd.drawImage(this.oImg, -this.xpos , -this.ypos);
	this.gd.restore();

	// this.gd.translate(this.xpos, this.ypos);
	// this.gd.rotate(d2a(t));
	// this.gd.translate(-this.xpos, -this.ypos);
	// this.gd.drawImage(this.oImg, this.xpos - this.oImg.width / 2, this.ypos - this.oImg.height / 2);
	// this.gd.restore();


	// 重绘中心小圆
	this.drow(20,this.config.start,this.config.end,this.config.mR);
	this.drow(10,this.config.start,this.config.end,this.config.sR);
}

// 指针移动 
createRound.prototype.pointerMove = function(id)
{
	if(this.bReady == true)return;

	this.bReady = true;

	var arr = this.config.data;
	var s;

	for(var i=0; i<arr.length; i++)
	{
		arr[i].s=i;

		if(arr[i].id == id)
		{
			s = i;
		}
	}

	var start = this.config.data[s].start;
	var end = this.config.data[s].end;

	t = rnd(start,end);

	var _this = this;

	// 进行度数
	var n = 0;

	// 速度
	var speed = 10;

	// 目标度数
	t = t+360;

	// 分界线
	var fjx = 360*3;
	
	this.timer=setInterval(function(){

		n+=speed;

		if( n >= fjx)
		{
			var lastN = n-fjx;

			speed=(t-lastN)/100;

			speed=Math.ceil(speed);

			if(lastN >= t)
			{
				clearInterval(_this.timer);
				alert('恭喜您获得'+arr[s].name);
				_this.bReady = false;

				n = 0;
			}
		}
		_this.clearOther(n);

	},30);	
};

// 绘制奖品信息
createRound.prototype.drowText = function(str,l,i)
{
	
	this.gd.save();
	this.gd.beginPath();


	this.gd.textBaseline='top';
	this.gd.textAlign='center';
	this.gd.font='16px a';


	this.gd.translate(this.config.cx,this.config.cy);

	var x = Math.sin(d2a(i*360/l)) * (this.config.r - 50);

	var y = Math.cos(d2a(i*360/l)) * (this.config.r - 50);

	this.gd.fillText(str,x,-y);


	this.gd.closePath();
	this.gd.restore();	
}
createRound.prototype.drowTextM = function()
{
	var arr = this.config.data;

	for(var i=0; i<arr.length; i++)
	{
		this.drowText(arr[i].name,arr.length,i);
	}
}





