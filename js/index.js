window.addEventListener("DOMContentLoaded", function () {
	initCrumbs();
	leftTapClick();
	bottomTapClick();
	zoom();
	thumb();
	goodsdetails();
	goodsParam();
	goodsParamClick();
	inputCheckClick();
	myMenu();
});
let imgindex = 0;
let selectd = 0;
function initCrumbs() {
	//获取goodData对象的path的值
	let pathData = goodData.path;
	// 获取路劲导航class="conPoin"的节点
	let conPoinEle = document.querySelector(".con .conPoin");
	let htmlStr = "";
	pathData.forEach(function (item, index) {
		// 最后各节点没有herf属性
		if (index !== pathData.length - 1) {
			htmlStr += `<a href = "${item.url}">${item.title}</a>`;
		} else {
			htmlStr += `<a>${item.title}</a>`;
		}
	});
	conPoinEle.innerHTML = htmlStr;
}
function leftTapClick() {
	let taps = document.querySelectorAll(
		".wrap .productDetail .aside .tabWrap h4"
	);
	let contents = document.querySelectorAll(
		".wrap .productDetail .aside .tabContent > div"
	);
	Array.from(taps).forEach(function (item, index) {
		item.onclick = function () {
			// 排他法
			for (let i = 0; i < taps.length; i++) {
				taps[i].classList.remove("active");
			}
			// 添加active的类名
			this.classList.add("active");
			// 绑定内容联动效果
			for (let j = 0; j < contents.length; j++) {
				contents[j].classList.remove("active");
			}
			contents[index].classList.add("active");
		};
	});
}
function bottomTapClick() {
	let taps = document.querySelectorAll(
		".wrap .productDetail .detail .intro .tabWrap li"
	);
	let contents = document.querySelectorAll(
		".wrap .productDetail .detail .intro .tabContent > div"
	);
	Array.from(taps).forEach(function (item, index) {
		// 绑定单击事件
		item.onclick = function () {
			// 排他法
			for (let i = 0; i < taps.length; i++) {
				taps[i].classList.remove("active");
			}
			this.classList.add("active");
			// 选项卡内容联动效果
			for (let j = 0; j < contents.length; j++) {
				contents[j].classList.remove("active");
			}
			contents[index].classList.add("active");
		};
	});
}
function zoom() {
	let smallBox = document.querySelector(
		".wrap .con .mainCon .previewWrap .preview .zoom"
	);
	let preview = document.querySelector(
		".wrap .con .mainCon .previewWrap .preview"
	);
	let maskBox = document.createElement("div");
	let bigImgBox = document.createElement("div");
	// 1、默认显示第一张图片
	let smallImg = new Image();
	let bigImg = new Image();
	smallImg.src = goodData.imgsrc[0].s;
	smallBox.appendChild(smallImg);
	// 2、移入鼠标（悬浮）时，创建mask遮掩容器，大图容器和大图图片
	smallBox.onmouseenter = function () {
		//创建一个mask类的遮掩
		maskBox.className = "mask";
		this.appendChild(maskBox);
		//大图容器和大图容器的图片
		bigImgBox.className = "bigBox";
		bigImg.src = goodData.imgsrc[imgindex].b;
		bigImgBox.appendChild(bigImg);
		preview.appendChild(bigImgBox);
		this.onmousemove = function (event) {
			// 获取鼠标移动坐标
			let maskLeft =
				event.clientX -
				this.getBoundingClientRect().left -
				maskBox.offsetWidth / 2;
			let maskTop =
				event.clientY -
				this.getBoundingClientRect().top -
				maskBox.offsetHeight / 2;
			// 控制遮掩box的最大移动距离
			maxMaskLeft = this.clientWidth - maskBox.offsetWidth;
			maxMaskTop = this.clientHeight - maskBox.offsetHeight;
			if (maskLeft >= 0 && maskLeft <= maxMaskLeft) {
				maskBox.style.left = maskLeft + "px";
			}
			if (maskTop >= 0 && maskTop <= maxMaskTop) {
				maskBox.style.top = maskTop + "px";
			}
			// 大图的处理，
			// 公式：遮掩移动距离 / 遮掩最大移动距离 = 大图移动距离 / 大图的最大移动距离
			let maxBigImgLeft = bigImg.clientWidth - bigImgBox.offsetWidth;
			let maxBigImgTop = bigImg.clientHeight - bigImgBox.offsetHeight;
			let bigImgLeft = (maskLeft * maxBigImgLeft) / maxMaskLeft;
			let bigImgTop = (maskTop * maxBigImgTop) / maxMaskTop;
			if (
				bigImgLeft >= 0 &&
				bigImgLeft <= maxBigImgLeft &&
				bigImgTop >= 0 &&
				bigImgTop <= maxBigImgTop
			) {
				bigImg.style.left = -bigImgLeft + "px";
				bigImg.style.top = -bigImgTop + "px";
			}
		};
		this.onmouseleave = function () {
			// 将mask类容器和大图容器删除掉
			this.removeChild(maskBox);
			preview.removeChild(bigImgBox);
			// 释放变量和事件
			this.onmousemove = null;
			this.onmouseleave = null;
		};
	};
}
function thumb() {
	// 遍历缩略图在list容器中
	let list = document.querySelector(
		".wrap .con .mainCon .previewWrap .specScroll .itemCon .list"
	);
	let next = document.querySelector(
		".wrap .con .mainCon .previewWrap .specScroll .next"
	);
	let prev = document.querySelector(
		".wrap .con .mainCon .previewWrap .specScroll .prev"
	);
	let leftMove = 0;
	let htmlStr = "";
	goodData.imgsrc.forEach(function (item) {
		htmlStr += `<li><img src=${item.s} alt="" /></li>`;
	});
	list.innerHTML = htmlStr;
	let lis = document.querySelectorAll(
		".wrap .con .mainCon .previewWrap .specScroll .itemCon .list > li"
	);
	let imgs = document.querySelectorAll(
		".wrap .con .mainCon .previewWrap .specScroll .itemCon .list > li img"
	);
	let smallImgEle = document.querySelector(
		".wrap .con .mainCon .previewWrap .preview .zoom img"
	);
	// 移动步长
	let step =
		lis[0].offsetWidth + parseInt(window.getComputedStyle(lis[0]).marginRight);
	// 左箭头绑定单击事件
	prev.onclick = function () {
		if (leftMove >= (lis.length - 5) * step) {
			return;
		}
		leftMove += step;
		list.style.left = -leftMove + "px";
	};
	// 右箭头
	next.onclick = function () {
		if (leftMove <= 0) {
			return;
		}
		leftMove -= step;
		list.style.left = -leftMove + "px";
	};
	// 给缩略图绑定单击事件
	Array.from(imgs).forEach(function (itemImg, index) {
		itemImg.onclick = function () {
			imgindex = index;
			// 改变小图的src的图片地址
			smallImgEle.src = this.src;
		};
	});
}
// 右侧物品详情
function goodsdetails() {
	//获取goodsData的数据
	let goodsDetailData = goodData.goodsDetail;
	let mountingsPrice = 0;
	let pLeftNode = document.querySelector(
		".wrap .productDetail .detail .fitting .goodSuits .master p"
	);
	let pRightNode = document.querySelector(
		".wrap .productDetail .detail .fitting .goodSuits .result .price"
	);
	let info = document.querySelector(".wrap .con .mainCon .infoWrap .info1");
	// 添加类名infoName的h3标题
	let h3 = document.createElement("h3");
	// 左边价格动态处理
	pLeftNode.innerText = "¥" + goodsDetailData.price;
	// 默认商品配件全部选中
	let inputNodes = document.querySelectorAll(
		".wrap .productDetail .detail .fitting .goodSuits .suits .suitsItem input"
	);
	let spanNode = document.querySelector(
		".wrap .productDetail .detail .fitting .goodSuits .result span"
	);
	inputNodes.forEach(function (inputNode) {
		inputNode.checked = true;
		mountingsPrice += Number(inputNode.value);
		selectd++;
	});
	spanNode.innerText = selectd;
	pRightNode.innerText = "¥" + (goodsDetailData.price + mountingsPrice);
	h3.className = "infoName";
	h3.innerText = goodsDetailData.title;
	info.appendChild(h3);
	//p新闻标签价格区
	let p = document.createElement("p");
	p.className = "news";
	p.innerText = goodsDetailData.recommend;
	info.appendChild(p);
	// 价格区域
	let divPrice = document.createElement("div");
	divPrice.className = "priceArea";
	divPrice.innerHTML = `<div class="priceArea1">
							<div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
							<div class="price">
								<i>￥</i>
								<em>${goodsDetailData.price}</em>
								<span>降价通知</span>
							</div>
							<div class="remark">
								<i>累计评价</i>
								<span>${goodsDetailData.evaluateNum}</span>
							</div>
						</div>
						<div class="priceArea2">
							<div class="title">促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</div>
							<div class="fixWidth">
								<i>${goodsDetailData.promoteSales.type}</i>
								<span>${goodsDetailData.promoteSales.content}</span>
							</div>
						</div>`;
	info.appendChild(divPrice);
	//support的支持区
	let divSupport = document.createElement("div");
	divSupport.className = "support";
	divSupport.innerHTML = `<div>
								<div class="title">支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</div>
								<div class="fixWidth">${goodsDetailData.support}</div>
							</div>
							<div>
								<div class="title">配&nbsp;送&nbsp;至</div>
								<div class="fixWidth">${goodsDetailData.address}</div>
							</div>`;
	info.appendChild(divSupport);
}
// 物品参数
function goodsParam() {
	let chooseArea = document.querySelector(
		".wrap .con .mainCon .infoWrap .choose .chooseArea"
	);
	// 获取物品的参数
	let crumbParams = goodData.goodsDetail.crumbData;
	crumbParams.forEach(function (params, index) {
		let dl = document.createElement("dl");
		// 保存dl的index坐标
		dl.setAttribute("dlIndex", index);
		let dt = document.createElement("dt");
		dt.innerText = params.title;
		dl.appendChild(dt);
		// 获取data参数数据
		params.data.forEach(function (datas) {
			let dd = document.createElement("dd");
			dd.innerText = datas.type;
			dd.setAttribute("price", datas.changePrice);
			dl.appendChild(dd);
		});
		chooseArea.appendChild(dl);
	});
}
// 选中商品的参数，参数进行高亮显示
function goodsParamClick() {
	/**
	 * 1、获取所有dl节点，并循环遍历，在当前的dl节点进行获取dd节点
	 * 2、循环遍历所有的dd节点，并绑定单击事件
	 * 3、利用排他法，将所有的dd节点颜色改为灰色，点击当前的dd节点改为红色高亮
	 */
	// 1、获取所有dl节点，并循环遍历，在当前的dl节点进行获取dd节点
	let regNum = /\d+/;
	let dlNodes = document.querySelectorAll(
		".wrap .con .mainCon .infoWrap .choose .chooseArea dl"
	);
	let choosed = document.querySelector(
		".wrap .con .mainCon .infoWrap .choose .chooseArea .choosed"
	);
	let pRightNode = document.querySelector(
		".wrap .productDetail .detail .fitting .goodSuits .result .price"
	);
	let pRightPrice = Number(pRightNode.innerText.match(regNum));
	// 创建空数组保存选择的参数
	let parameters = new Array(4);
	parameters.fill(0);
	dlNodes.forEach(function (dlNode) {
		// 在当前的dl节点进行获取dd节点
		let ddNodes = dlNode.querySelectorAll(
			".wrap .con .mainCon .infoWrap .choose .chooseArea dl dd"
		);
		// 2、循环遍历所有的dd节点
		ddNodes.forEach(function (ddNode) {
			// dd节点绑定单击事件
			ddNode.onclick = function () {
				// 排他法
				ddNodes.forEach(function (dd) {
					dd.style.color = "#666";
				});
				this.style.color = "red";
				// 获取当前的dl标签的下标值
				let dlIndex = dlNode.getAttribute("dlIndex");
				// 点击dl下面的dd标签，将dd标签值存储在数组当中
				parameters[dlIndex] = this;
				// 计算价格
				linkPrice(parameters, pRightPrice);
				choosed.innerText = "";
				// 遍历数组中的参数，并且创建mask标签
				parameters.forEach(function (goodsParam, arrindex) {
					//创建mask的标签
					let mark = document.createElement("mark");
					let a = document.createElement("a");
					if (!goodsParam.innerText) {
						return;
					}
					mark.innerText = goodsParam.innerText;
					a.innerText = "X";
					a.setAttribute("arrindex", arrindex);
					mark.appendChild(a);
					choosed.appendChild(mark);
				});
				let aNodes = document.querySelectorAll(
					".wrap .con .mainCon .infoWrap .choose .chooseArea .choosed mark a"
				);
				// 点击“X”，可以删除选中节点，则为a绑定单击事件
				aNodes.forEach(function (aNode) {
					aNode.onclick = function () {
						// 移除相应的mark标签
						choosed.removeChild(this.parentNode);
						// 该选择项恢复默认选中
						let currentIndex = this.getAttribute("arrindex");
						// 更新存储参数的数组，删除的参数在数值赋值为0
						parameters[currentIndex] = 0;
						// 移除参数，价格相应的减少
						linkPrice(parameters, pRightPrice);
						let ddnodes = dlNodes[currentIndex].querySelectorAll("dd");
						ddnodes.forEach(function (ddnode) {
							ddnode.style.color = "#666";
						});
						ddnodes[0].style.color = "red";
					};
				});
			};
		});
	});
}
// 选择标签，价格价格联动
function linkPrice(parameters, pRightPrice) {
	/**
	 * 思路：遍历parameters数组，获取到选中的dd节点price值
	 * 		 获取原有基础的价格，也就是基本价格
	 * 		 将他们进行求和
	 */
	let regNum = /\d+/;
	// 每执行一次计算，都会初始化原有的价格，保证价格计算不会重复
	let totalPrice = goodData.goodsDetail.price;
	let emNode = document.querySelector(
		".wrap .con .mainCon .infoWrap .info1 .priceArea .priceArea1 .price em"
	);
	let pLeftNode = document.querySelector(
		".wrap .productDetail .detail .fitting .goodSuits .master p"
	);
	let pRightNode = document.querySelector(
		".wrap .productDetail .detail .fitting .goodSuits .result .price"
	);
	let pLeftPrice = goodData.goodsDetail.price;
	// 遍历parameters数组，获取到选中的dd节点price值
	parameters.forEach(function (ddNode, index) {
		if (!ddNode) {
			return;
		}
		let ddPrice = ddNode.getAttribute("price");
		totalPrice += Number(ddPrice);
		pLeftPrice += Number(ddPrice);
		pRightPrice += Number(ddPrice);
	});
	emNode.innerText = totalPrice;
	pLeftNode.innerText = "¥" + pLeftPrice;
	pRightNode.innerText = "¥" + pRightPrice;
}
// 选择商品标签，右边价格进行变动
function inputCheckClick() {
	let inputNodes = document.querySelectorAll(
		".wrap .productDetail .detail .fitting .goodSuits .suits .suitsItem input"
	);
	let pRightNode = document.querySelector(
		".wrap .productDetail .detail .fitting .goodSuits .result .price"
	);
	let spanNode = document.querySelector(
		".wrap .productDetail .detail .fitting .goodSuits .result span"
	);
	let currentRightPrice = Number(pRightNode.innerText.substring(1));
	// 获取所有input节点，遍历循环得到每个具体的节点，绑定单击事件
	inputNodes.forEach(function (inputNode) {
		inputNode.onclick = function () {
			// console.log(this.checked);
			// 如果是选中状态，点击就改为未选中
			if (!this.checked) {
				// 获取当前input节点的value值
				// 获取右边价格的当前值，再减去input的value
				// console.log(this.value);
				currentRightPrice -= this.value;
				selectd--;
				pRightNode.innerText = "¥" + currentRightPrice;
				spanNode.innerText = selectd;
			} else {
				currentRightPrice += Number(this.value);
				selectd++;
				pRightNode.innerText = "¥" + currentRightPrice;
				spanNode.innerText = selectd;
			}
		};
	});
}
// 个人菜单窗口
function myMenu() {
	let toolBarNode = document.querySelector(".wrap .toolBar");
	let butNode = document.querySelector(".wrap .toolBar .but");
	let liNodes = document.querySelectorAll(".wrap .toolBar .toolList li");
	// 各人菜单窗口默认状态是关着的
	let isOpen = false;
	// 默认是折叠
	let isRollOut = false;
	butNode.onclick = function () {
		isOpen = !isOpen;
		if (isOpen) {
			toolBarNode.className = "toolBar toolOut";
			this.className = "but cross";
		} else {
			toolBarNode.className = "toolBar toolWrap";
			this.className = "but list";
		}
	};
	// 各人具体菜单滑动效果
	liNodes.forEach(function (liNode) {
		liNode.onmouseenter = function () {
			if (!isRollOut) {
				let iNode = this.querySelector("i");
				let emNode = this.querySelector("em");
				iNode.style.backgroundColor = "rgb(" + 200 + "," + 17 + "," + 34 + ");";
				emNode.style.left = -62 + "px";
			}
			isRollOut = !isRollOut;
		};
		liNode.onmouseleave = function () {
			if (isRollOut) {
				let iNode = this.querySelector("i");
				let emNode = this.querySelector("em");
				iNode.style.backgroundColor =
					"rgb(" + 122 + "," + 110 + "," + 110 + ");";
				emNode.style.left = 35 + "px";
			}
			isRollOut = !isRollOut;
		};
	});
}
