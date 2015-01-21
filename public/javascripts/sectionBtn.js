define(function(require){

	var $ = require('jquery');

	var btnTemplate = '<div class="sectionButton"></div>';

	var SectionBtn = function(){
		this.active = false;

		var $context = $(btnTemplate);
		this.setContext($context);
	};

	var p = SectionBtn.prototype;

	p.setContext = function($context)
	{
		this.$context = $context;
	};

	p.setActive = function(active)
	{
		if (this.active != active)
		{
			this.active = active;

			if (this.active)
			{
				this.$context.addClass('active');
			}
			else
			{
				this.$context.removeClass('active');
			}
		}
	};

	return SectionBtn;
});