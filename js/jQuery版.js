/**
 * 加载dom树结构和媒体资源加载完毕之后执行
 * $(function () {});
 */
// 加载Dom树结构
$(document).ready(function () {
	$.initCrumbs();
	$.zoom();
	$.thumb();
	$.info();
	$.parmaClick();
	$.cancelMounting();
	$.toggleTabs();
	$.myMenu();
});
let $zoom = $(".wrap .con .mainCon .previewWrap .preview .zoom");
let $preview = $(".wrap .con .mainCon .previewWrap .preview");
let $imgsrc = goodData.imgsrc;
let shopPrice = goodData.goodsDetail.price;
let $priceNode = $(
	".wrap .productDetail .detail .fitting .goodSuits .result .price"
);
let rightPriceReg = /\d+/;
$.initCrumbs = function () {
	let a = null;
	// 获取data.js中path数据
	let $paths = goodData.path;
	let $conPoin = $(".wrap .con .conPoin");
	$paths.forEach(function ($pathObj, index) {
		if (index === $paths.length - 1) {
			a = $(`<a>${$pathObj.title}</a>`);
		} else {
			a = $(`<a href="${$pathObj.url}">${$pathObj.title}</a>`);
		}
		$conPoin.append(a);
	});
};
$.zoom = function () {
	// 默认显示第一张小图
	let img = $(`<img src="${$imgsrc[0].s}">`);
	$zoom.append(img);
	/**
	 * 移入鼠标（悬浮）时，在zoom下创建mask标签，在preview下创建bigbox标签
	 * 事件绑定方法：jQuery对象.on(type,callback)
	 */
	$zoom.on("mouseenter", function () {
		// 在zoom下创建类名：mask的div标签，在preview下创建类名：bigbox标签
		let $mask = $(`<div class = "mask"></div>`);
		let $bigBox = $(`<div class = "bigBox"></div>`);
		let $img = $(".wrap .con .mainCon .previewWrap .preview .zoom img");
		// 大盒子中图片与小盒子的图片联动
		let $bigimg = $(`<img src = "${$img.prop("src")}" />`);
		$bigBox.append($bigimg);
		$zoom.append($mask);
		$preview.append($bigBox);
		$(this).on("mousemove", function (event) {
			// 遮掩盒子在zoom的盒子移动
			// 获取遮掩盒子移动距离
			let maskLeft =
				event.clientX -
				this.getBoundingClientRect().left -
				$mask.outerWidth() / 2;
			let maskTop =
				event.clientY -
				this.getBoundingClientRect().top -
				$mask.outerHeight() / 2;
			// 最大移动距离
			let maxMaskLeft = $zoom.innerWidth() - $mask.outerWidth();
			let maxMaskTop = $zoom.innerHeight() - $mask.outerHeight();
			// 限制遮掩盒子加上限制边界
			if (
				0 <= maskLeft &&
				maskLeft <= maxMaskLeft &&
				0 <= maskTop &&
				maskTop <= maxMaskTop
			) {
				$mask.css({ top: maskTop, left: maskLeft });
			}
			/**
			 * 放大镜大图的公式：
			 *      小图移动距离/小图最大移动距离 = 大图移动距离/大图移动距离
			 */
			let maxBigImgLeft = $bigimg.innerWidth() - $bigBox.outerWidth();
			let maxBigImgTop = $bigimg.innerHeight() - $bigBox.outerHeight();
			let bigImgLeft = (maskLeft * maxBigImgLeft) / maxMaskLeft;
			let bigImgTop = (maskTop * maxBigImgTop) / maxMaskTop;
			if (
				0 <= bigImgLeft &&
				bigImgLeft <= maxBigImgLeft &&
				0 <= bigImgTop &&
				bigImgTop <= maxBigImgTop
			) {
				$bigimg.css({ left: -bigImgLeft, top: -bigImgTop });
			}
		});
		$(this).on("mouseleave", function () {
			$mask.remove();
			$bigBox.remove();
			$(this).off("mouseover").off("mouseleave");
		});
	});
};
$.thumb = function () {
	/**
	 *  遍历数组的小图，放在类名list的ul列表中
	 *  点击左右箭头，缩略图进行移动，并且小图也跟着切换
	 *  点击缩略图，小图大图进行联动
	 */
	let ulNode = $(".wrap .con .mainCon .previewWrap .specScroll .itemCon .list");
	let prevNode = $(".wrap .con .mainCon .previewWrap .specScroll .prev");
	let nextNode = $(".wrap .con .mainCon .previewWrap .specScroll .next");
	$imgsrc.forEach(function (imgObj) {
		let li = $(`<li><img src="${imgObj.s}" alt=""></li>`);
		ulNode.append(li);
	});
	let $liNodes = $(
		".wrap .con .mainCon .previewWrap .specScroll .itemCon .list > li"
	);
	let $imgNodes = $(
		".wrap .con .mainCon .previewWrap .specScroll .itemCon .list > li img"
	);
	let rightMargin = parseInt(window.getComputedStyle($liNodes[0]).marginRight);
	let step = $liNodes[0].offsetWidth + rightMargin;
	let steps = 0;
	let smallImgIndex = 0;
	// 点击左右箭头，缩略图进行移动，并且小图也跟着切换
	prevNode.on("click", function () {
		if (steps >= 0 && steps <= ($liNodes.length - 5 - 1) * step) {
			// 闭包变量长期保存在内存中
			steps += step;
			ulNode.css("left", -steps);
			$zoom.html(`<img src="${$imgsrc[++smallImgIndex].s}">`);
		}
	});
	nextNode.on("click", function () {
		console.log("点击了右箭头");
		if (steps > 0) {
			steps -= step;
			ulNode.css("left", -steps);
			$zoom.html(`<img src="${$imgsrc[--smallImgIndex].s}">`);
		}
	});
	/**
     * jquery对象.each(function(k,v){
	        // to do ...
        });
     */
	// 点击缩略图，小图大图进行联动
	$imgNodes.each(function (k, imgNode) {
		$(imgNode).on("click", function () {
			$zoom.html(`${this.parentNode.innerHTML}`);
		});
	});
};
$.info = function () {
	let goodsDetail = goodData.goodsDetail;
	let infoNode = $(".wrap .con .mainCon .infoWrap");
	infoNode.html(` <div class="info1">
                        <h3 class="infoName">
                            ${goodsDetail.title}
                        </h3>
                        <p class="news">
                            ${goodsDetail.recommend}
                        </p>
                        <div class="priceArea">
                            <div class="priceArea1">
                                <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
                                <div class="price">
                                    <i>￥</i>
                                    <em>${goodsDetail.price}</em>
                                    <span>降价通知</span>
                                </div>
                                <div class="remark">
                                    <i>累计评价</i>
                                    <span>${goodsDetail.evaluateNum}</span>
                                </div>
                            </div>
                            <div class="priceArea2">
                                <div class="title">促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</div>
                                <div class="fixWidth">
                                    <i>${goodsDetail.promoteSales.type}</i>
                                    <span>
                                        ${goodsDetail.promoteSales.content}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="support">
                            <div>
                                <div class="title">支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</div>
                                <div class="fixWidth">${goodsDetail.support}</div>
                            </div>
                            <div>
                                <div class="title">配&nbsp;送&nbsp;至</div>
                                <div class="fixWidth">${goodsDetail.address}</div>
                            </div>
                        </div>
                    </div>`);
	// 创建choose节点
	let chooseDiv = $(`<div class = "choose"></div>`);
	// 创建chooseArea节点
	let chooseAreaDiv = $(
		`<div class = "chooseArea"><div class="choosed"></div></div>`
	);
	// 创建carwrap节点
	let carWarpDiv = $(`<div class="carWrap">
                            <div class="controls">
                                <input type="text" value="1" />
                                <a href="###" class="plus">+</a>
                                <a href="###" class="mins">-</a>
                            </div>
                            <div class="addBtn">
                                <a href="###">加入购物车</a>
                            </div>
                        </div>`);
	infoNode.append(chooseDiv);
	chooseDiv.append(chooseAreaDiv);
	chooseDiv.append(carWarpDiv);
	//获取crubData数组，数组的每一项就是一个dl标签
	let crumbData = goodData.goodsDetail.crumbData;
	crumbData.forEach(function (arrObj, dlindex) {
		let dlNode = $(`<dl><dt>${arrObj.title}</dt></dl>`);
		dlNode.attr("dlindex", dlindex);
		chooseAreaDiv.append(dlNode);
		// 遍历data数组在dd标签中
		arrObj.data.forEach(function (Parma, ddindex) {
			let ddNode = $(`<dd price = "${Parma.changePrice}">${Parma.type}</dd>`);
			dlNode.append(ddNode);
		});
	});
	$.mountingsPrice();
};
$.parmaClick = function () {
	let $dlNodes = $(".wrap .con .mainCon .infoWrap .choose .chooseArea dl");
	let $choosed = $(
		".wrap .con .mainCon .infoWrap .choose .chooseArea .choosed"
	);
	let rightPrice = Number($priceNode.text().match(rightPriceReg));
	let selectParmas = new Array(4);
	selectParmas.fill(0);
	// 获取所有的dd标签
	$dlNodes.each(function (dlindex, dlNode) {
		let $ddNodes = $(dlNode).children("dd");
		$ddNodes.each(function (key, ddNode) {
			// console.log(key, ddNode);key,value值是一个dom对象
			$(ddNode).on("click", function () {
				// 点击参数将会变色
				$ddNodes.each(function (key2, ddNodeColor) {
					$(ddNodeColor).css("color", "#666");
				});
				$(this).css("color", "red");
				selectParmas[dlindex] = this;
				$choosed.html("");
				// 点击参数，遍历循环selectParmas，在类名为choosed下创建mask标签
				selectParmas.forEach(function (parmaValue, parmaIndex) {
					if (!parmaValue) {
						return;
					} else {
						let mark = $(
							`<mark>${$(
								parmaValue
							).text()}<a arrindex = "${parmaIndex}">X</a></mark>`
						);
						$choosed.append(mark);
					}
				});
				// 计算商品的价格
				$.linkPrice(selectParmas, rightPrice);
				let $aNodes = $(
					".wrap .con .mainCon .infoWrap .choose .chooseArea .choosed mark a"
				);
				// 点击X号，删除父mask标签，并且将参数的值改回默认初始值
				$aNodes.each(function (aNodekey, aNode) {
					// 绑定单击事件，删除mask标签
					$(aNode).on("click", function () {
						$(this).parent().remove();
						// $ddnodes = $(
						// 	".wrap .con .mainCon .infoWrap .choose .chooseArea dl dd"
						// );
						let dlindex = $(this).attr("arrindex");
						selectParmas[dlindex] = 0;
						let dds = $dlNodes[dlindex].querySelectorAll("dd");
						// 参数恢复默认值
						$(dds).each(function (key, ddnodeColor) {
							$(ddnodeColor).css("color", "#666");
						});
						dds[0].style.color = "red";
						$.linkPrice(selectParmas, rightPrice);
					});
				});
			});
		});
	});
};
$.linkPrice = function (parmaArr, rightPrice) {
	let $emNode = $(
		".wrap .con .mainCon .infoWrap .info1 .priceArea .priceArea1 .price em"
	);
	let $pNode = $(".wrap .productDetail .detail .fitting .goodSuits .master p");
	let totalPrice = 0;
	totalPrice = totalPrice + shopPrice;
	parmaArr.forEach(function (ddNode) {
		if (!ddNode) {
			return;
		}
		let price = Number(ddNode.getAttribute("price"));
		totalPrice += price;
		rightPrice += price;
	});
	$emNode.text(totalPrice);
	$pNode.text(`¥${totalPrice}`);
	$priceNode.text(`¥${rightPrice}`);
};
// 默认全选配件价格处理
$.mountingsPrice = function () {
	let totalPrice = 0;
	totalPrice += shopPrice;
	let $priceNode = $(
		".wrap .productDetail .detail .fitting .goodSuits .result .price"
	);
	// 默认选中所有的配件
	let $inputNodes = $(
		".wrap .productDetail .detail .fitting .goodSuits .suits .suitsItem input"
	);
	$inputNodes.each(function (key, inputNode) {
		$(inputNode).prop("checked", true);
		let mountingPrice = Number($(inputNode).attr("value"));
		totalPrice += mountingPrice;
	});
	$priceNode.text(`¥${totalPrice}`);
};
// 取消选择的配件，同时改变联动价格
$.cancelMounting = function () {
	// 取消配件
	let $inputNodes = $(
		".wrap .productDetail .detail .fitting .goodSuits .suits .suitsItem input"
	);
	let rightPrice = Number($priceNode.text().match(rightPriceReg));
	$inputNodes.each(function (key, inputNode) {
		// 为inputNodes绑定单击事件
		$(inputNode).on("click", function () {
			let price = Number($(this).attr("value"));
			if (!$(this).prop("checked")) {
				// 取消该配件
				rightPrice -= price;
			} else {
				// 选择该配件
				rightPrice += price;
			}
			$priceNode.text(`¥${rightPrice}`);
		});
	});
};
$.toggleTabs = function () {
	// 商品分类
	let $h4Nodes = $(".wrap .productDetail .aside .tabWrap h4");
	let $divNodes = $(".wrap .productDetail .aside .tabContent > div");
	let $liNodes = $(".wrap .productDetail .detail .intro .tabWrap > li");
	let $parmaDivNodes = $(
		".wrap .productDetail .detail .intro .tabContent > div"
	);
	$h4Nodes.each(function (key, h4Node) {
		$(h4Node).on("click", function () {
			$(this).addClass("active").siblings().removeClass("active");
			console.log($divNodes[key]);
			$($divNodes[key]).addClass("active").siblings().removeClass("active");
		});
	});
	$liNodes.each(function (key, liNode) {
		$(liNode).on("click", function () {
			console.log("单击了");
			$(this).addClass("active").siblings().removeClass("active");
			$($parmaDivNodes[key])
				.addClass("active")
				.siblings()
				.removeClass("active");
		});
	});
};
// 个人菜单窗口
$.myMenu = function () {
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
};
