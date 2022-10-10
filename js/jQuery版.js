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
});
let $zoom = $(".wrap .con .mainCon .previewWrap .preview .zoom");
let $preview = $(".wrap .con .mainCon .previewWrap .preview");
let $imgsrc = goodData.imgsrc;
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
	console.log("商品基本信息");
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
	crumbData.forEach(function (index, arrObj) {
		console.log(index, arrObj);
		// let dlNode = $("")
	});
};
