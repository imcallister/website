define(function(require){

	var $ = require('jquery');
	var signals = require('lib/signals');

	var SectionBtn = require('SectionBtn');

	var ContentSectionManager = function(){
		this.$sections = [];
		this.$sectionBtns = [];

		this.on = {
			'change': new signals.Signal()
		}
	};

	var p = ContentSectionManager.prototype;

	p.setContext = function($context)
	{
		this.$context = $context;
	}

	p.addSection = function($section)
	{
		var self = this;

		this.$sections.push($section);

		var index = this.$sections.length - 1;

		var $btn = new SectionBtn();

		$btn.$context.click(function(){
			// console.log('click', index);
			self.setActiveSection(index, true);
		});

		this.$context.append($btn.$context);

		this.$sectionBtns.push($btn);
	};

	p.setActiveSection = function(activeIndex, forceAnimation)
	{
		for (var i=0, len=this.$sectionBtns.length; i<len; i++)
		{
			this.$sectionBtns[i].setActive(false);
		}

		this.$sectionBtns[activeIndex].setActive(true);

		this.on.change.dispatch(activeIndex, forceAnimation);
	};

	//	p.onScroll = function()
	//	{

	//	};

	return ContentSectionManager;
});