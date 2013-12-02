/*
 * jQuery jEmotion
 *
 * @version: 0.3
 * @update: 2011.11.04
 * @author: alswl
 * @website: http://log4d.com/2011/11/jemotion
 * @demo: http://lab.log4d.com/javascript/jEmotion/demo.html
 * @source: https://github.com/alswl/jEmotion
 *
 * Dual licensed under the and GPL licenses:
 *   http://www.gnu.org/licenses/gpl.html
 * 
 */


var jEmotion = {

	/**
	 * 插件设定
	 */
	settings: {
		input: null, //input textarea
		handler: null, //触发按钮
		imagePath: 'images', //图片相对路径
		converts: '' //启动转换的元素 TODO: 捕捉body会出现问题
	},

	/**
	 * 定义文本图片对应关系
	 */
	smilesMaps: {"呵呵":"smile.gif","嘻嘻":"tooth.gif","哈哈":"/laugh.gif","爱你":"love.gif","晕":"dizzy.gif","泪":"sad.gif","馋嘴":"cz_thumb.gif","抓狂":"crazy.gif","哼":"hate.gif","抱抱":"bb_thumb.gif","可爱":"tz_thumb.gif","怒":"angry.gif","汗":"sweat.gif","困":"sleepy.gif","害羞":"shame_thumb.gif","睡觉":"sleep_thumb.gif","钱":"money_thumb.gif","偷笑":"hei_thumb.gif","酷":"cool_thumb.gif","衰":"cry.gif","吃惊":"cj_thumb.gif","闭嘴":"bz_thumb.gif","鄙视":"bs2_thumb.gif","挖鼻屎":"kbs_thumb.gif","花心":"hs_thumb.gif","鼓掌":"gz_thumb.gif","失望":"sw_thumb.gif","思考":"sk_thumb.gif","生病":"sb_thumb.gif","亲亲":"qq_thumb.gif","怒骂":"nm_thumb.gif","太开心":"mb_thumb.gif","懒得理你":"ldln_thumb.gif","右哼哼":"yhh_thumb.gif","左哼哼":"zhh_thumb.gif","嘘":"x_thumb.gif","委屈":"wq_thumb.gif","吐":"t_thumb.gif","可怜":"kl_thumb.gif","打哈气":"k_thumb.gif","顶":"d_thumb.gif","疑问":"yw_thumb.gif","做鬼脸":"zgl_thumb.gif","握手":"ws_thumb.gif","耶":"ye_thumb.gif","强":"good_thumb.gif","弱":"sad_thumb.gif","不要":"no_thumb.gif","好的":"ok_thumb.gif","赞":"z2_thumb.gif","来":"come_thumb.gif","蛋糕":"cake.gif","心":"heart.gif","伤心":"unheart.gif","钟":"clock_thumb.gif","猪头":"pig.gif","话筒":"m_thumb.gif","月亮":"moon.gif","太阳":"sun.gif","下雨":"rain.gif"},

    /**
     * 初始化对向
     * @param {Object} input 保存文本的输入框 jQuery DOM
     * @param {Object} handler 触发动作的按钮 jQuery DOM
     * @param {string} imagePath 图片所在的路径
     */
	init: function() {
		if (jEmotion.settings.handler == null || jEmotion.settings.imagePath == null ||
			jEmotion.settings.input == null) {
			alert('jEmotion load error setting.');
			return false;
		}

		$(jEmotion.settings.converts).each(function() {
			$(this).html(jEmotion.code2html($(this).html(), jEmotion.settings.imagePath, jEmotion.smilesMaps)); //在前端页面实现js效果
		});

		jEmotion.bindHandlerClickEvent($(jEmotion.settings.handler), jEmotion.settings.imagePath, jEmotion.smilesMaps);
		jEmotion.bindEmotionClickEvent($(jEmotion.settings.input));
		$("html").click(function(){
			$("#je_emotions").hide();
		});
	},

    /**
     * 插入html到页面
     */
	insertHtml: function(imagePath, smilesMaps) {
		var html = '<style>#je_emotions{width:364px; position:absolute;border:1px solid #aaa;border-top:none;z-index:9999; text-align:center;padding:3px;padding-bottom:6px;background:#fff;} #je_emotions a img{float:left;cursor:pointer;margin:1px 1px; border:#cacaca 1px solid;visibility:visible;}  #je_emotions a:hover img{border:1px solid #f51d69} </style>';
		html += '<div id="je_emotions">';
		for (i in smilesMaps) {
			html += '<a href="javascript:;">' +
				jEmotion.code2img(i, imagePath, smilesMaps) + '</a>';
		}
		html += '</div>'
		$("body").append(html);
	},

	/*
	 * 设定表情框位置
	 */
	setPosition: function(handler) {
		var top = handler.offset().top;
		var left = handler.offset().left;
		$("#je_emotions").css("top", parseInt(top) + "px");
		$("#je_emotions").css("left", parseInt(left) + "px");
	},

    /**
     * 绑定触发点击事件
     */
	bindHandlerClickEvent: function(handler, imagePath, smilesMaps) {
		handler.live('click', function(event) {
			if ($('#je_emotions').size() > 0) { //如果存在就切换显示
				$('#je_emotions').toggle();
			} else {
				jEmotion.insertHtml(imagePath, smilesMaps);
			}
			jEmotion.setPosition(handler);
		});
	},

    /**
     * 绑定触发点击事件
     */
	bindEmotionClickEvent: function(input) {
		$("#je_emotions img").live('click', (function() {
			jEmotion.insertToCursor(input, '[' + $(this).attr('title') +']');
		}));
	},

    /**
     * 替换表情到文件名
     */
	code2html: function(text, imagePath, smilesMaps) {
		var match = /\[([\u4e00-\u9fa5]*)\]/g; 
		var e;
		while(e = match.exec(text)){
			text = text.replace(e[0], jEmotion.code2img(e[1], imagePath, smilesMaps));
		}
		return text;
	},

	/**
	 * 转换 哈哈 -> <img/>
	 */
	code2img: function(code, imagePath, smilesMaps) {
		return '<img src="' + imagePath + smilesMaps[code] +
				'" title="' + code +'" />';
	},

	/**
	 * 光标处插入 //TODO 光标返回原来位置
	 */
	insertToCursor: function(input, text) {
		var length = input.val().length;
		input.focus();
		if(typeof document.selection !="undefined") {
			document.selection.createRange().text = text; 
			document.selection.createRange().select();
		} else {
			input.val(input.val().substr(0, input[0].selectionStart) + text + 
				input.val().substring(input[0].selectionStart, length));
		}
	}
}

$.fn.jEmotion  = function(settings){    
	jEmotion.settings.input = $(this);
    $.extend(jEmotion.settings, settings);
	jEmotion.init();
    return $(this);
}
