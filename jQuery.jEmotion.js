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

/**
	 * 定义文本图片对应关系
	 */
var smilesMaps = {
		"呵呵":"smile.gif",
		"嘻嘻":"tooth.gif",
		"哈哈":"/laugh.gif",
		"爱你":"love.gif",
		"晕":"dizzy.gif",
		"泪":"sad.gif",
		"馋嘴":"cz_thumb.gif",
		"抓狂":"crazy.gif",
		"哼":"hate.gif",
		"抱抱":"bb_thumb.gif",
		"可爱":"tz_thumb.gif",
		"怒":"angry.gif",
		"汗":"sweat.gif",
		"困":"sleepy.gif",
		"害羞":"shame_thumb.gif",
		"睡觉":"sleep_thumb.gif",
		"钱":"money_thumb.gif",
		"偷笑":"hei_thumb.gif",
		"酷":"cool_thumb.gif",
		"衰":"cry.gif",
		"吃惊":"cj_thumb.gif",
		"闭嘴":"bz_thumb.gif",
		"鄙视":"bs2_thumb.gif",
		"挖鼻屎":"kbs_thumb.gif",
		"花心":"hs_thumb.gif",
		"鼓掌":"gz_thumb.gif",
		"失望":"sw_thumb.gif",
		"思考":"sk_thumb.gif",
		"生病":"sb_thumb.gif",
		"亲亲":"qq_thumb.gif",
		"怒骂":"nm_thumb.gif",
		"太开心":"mb_thumb.gif",
		"懒得理你":"ldln_thumb.gif",
		"右哼哼":"yhh_thumb.gif",
		"左哼哼":"zhh_thumb.gif",
		"嘘":"x_thumb.gif",
		"委屈":"wq_thumb.gif",
		"吐":"t_thumb.gif",
		"可怜":"kl_thumb.gif",
		"打哈气":"k_thumb.gif",
		"顶":"d_thumb.gif",
		"疑问":"yw_thumb.gif",
		"做鬼脸":"zgl_thumb.gif",
		"握手":"ws_thumb.gif",
		"耶":"ye_thumb.gif",
		"强":"good_thumb.gif",
		"弱":"sad_thumb.gif",
		"不要":"no_thumb.gif",
		"好的":"ok_thumb.gif",
		"赞":"z2_thumb.gif",
		"来":"come_thumb.gif",
		"蛋糕":"cake.gif",
		"心":"heart.gif",
		"伤心":"unheart.gif",
		"钟":"clock_thumb.gif",
		"猪头":"pig.gif",
		"话筒":"m_thumb.gif",
		"月亮":"moon.gif",
		"太阳":"sun.gif",
		"下雨":"rain.gif"};

var jEmotion = function (settings_) {
	var jemo = new Object();

	jemo.settings = settings_;
	jemo._this = $(jemo.settings.input);
	jemo.handler = $("#" + jemo.settings.handler);
	/**
	 * 插件设定
	
	settings: {
		input: null, //input textarea
		handler: null, //触发按钮
		imagePath: 'images', //图片相对路径
		converts: '' //启动转换的元素 TODO: 捕捉body会出现问题
	},*/

    /**
     * 初始化对向
     */
	jemo.init = function() {

		if (jemo.settings.handler == null || jemo.settings.imagePath == null ||
			jemo.settings.input == null) {
			alert('jEmotion load error setting.');
			return false;
		}
		jemo.bindHandlerClickEvent();
		jemo.bindEmotionClickEvent();
		$("html").click(function(){
			$(".je_emotions").hide();
		});
		return jemo;
	};

	jemo.textId = function(){
		return 'emo_'+jemo.settings.input;
	};

    /**
     * 插入html到页面
     */
	jemo.insertHtml = function() {
		var html = '<style>.je_emotions{width:364px; position:absolute;border:1px solid #aaa;border-top:none;z-index:9999; text-align:center;padding:3px;padding-bottom:6px;background:#fff;} .je_emotions a img{float:left;cursor:pointer;margin:1px 1px; border:#cacaca 1px solid;visibility:visible;} .je_emotions a:hover img{border:1px solid #f51d69} </style>';
		html += '<div class="je_emotions" id="'+jemo.textId()+'" >';
		for (i in smilesMaps) {
			html += '<a href="javascript:;">' +
				jemo.code2img(i) + '</a>';
		}
		html += '</div>'

		$("body").append(html);
	};

	/*
	 * 设定表情框位置
	 */
	jemo.setPosition = function() {
		var top = jemo.handler.offset().top;
		var left = jemo.handler.offset().left;
		$('#' + jemo.textId()).css("top", parseInt(top) + "px");
		$('#' + jemo.textId()).css("left", parseInt(left) + "px");
	};

    /**
     * 绑定触发点击事件
     */
	jemo.bindHandlerClickEvent = function() {
	
		jemo.handler.live('click', function(event) {
			
			if ($('#' + jemo.textId()).size() > 0) { //如果存在就切换显示
				$('#' + jemo.textId()).toggle();
			
			} else {
				jemo.insertHtml();
			}
			jemo.setPosition();
		});
	};

    /**
     * 绑定触发点击事件
     */
	jemo.bindEmotionClickEvent = function() {
		$("#" + jemo.textId() +" img").live('click', (function() {
			jemo.insertToCursor('[' + $(this).attr('title') +']');
		}));
	};

    /**
     * 替换表情到文件名
     */
	jemo.code2html =  function(text) {
		var match = /\[([\u4e00-\u9fa5]*)\]/g; 
		var e;
		while(e = match.exec(text)){
			text = text.replace(e[0], jemo.code2img(e[1]));
		}
		return text;
	};

	/**
	 * 转换 哈哈 -> <img/>
	 */
	jemo.code2img = function(code) {
		return '<img src="' + jemo.settings.imagePath + smilesMaps[code] +
				'" title="' + code +'" />';
	};

	/**
	 * 光标处插入 //TODO 光标返回原来位置
	 */
	jemo.insertToCursor = function(text) {
		var input = $("#" + jemo.settings.input);
		var length = input.val().length;
		input.focus();
		if(typeof document.selection !="undefined") {
			document.selection.createRange().text = text; 
			document.selection.createRange().select();
		} else {
			input.val(input.val().substr(0, input[0].selectionStart) + text + 
				input.val().substring(input[0].selectionStart, length));
		}
	};

	return jemo;
};

$.fn.jEmotion  = function(settings_){    
	//jEmotion.settings.input = $(this);
    //$.extend(jEmotion.settings, settings);
	//jEmotion.init();
    //return $(this);
    return new jEmotion(settings_).init();
};
