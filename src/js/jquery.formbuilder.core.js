/*
 * Main component of JQuery Form Builder plugin, the Form Builder container itself 
 * consists of builder palette contains widgets supported by the form builder and 
 * builder panel where the constructed form display. 
 * 
 * Revision: @REVISION
 * Version: @VERSION
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 
 */

var FormBuilder = {
  options: { // default options. values are stored in widget's prototype
		widgets : ['PlainText'],
		_builderForm: '#builderForm fieldset',
		_emptyBuilderPanel: '#emptyBuilderPanel',
		_standardFieldsPanel: '#standardFields',
		_fancyFieldsPanel: '#fancyFields',
    _fieldSettingsLanguageSection: '#fieldSettings fieldset.language:first',
    _fieldSettingsGeneralSection: '#fieldSettings div.general:first'
  },
  _create: function() {
    	// called on construction
    this._log('FormBuilder._create called. this.options.widgets = ' + this.options.widgets);
    this._initBuilderPalette();
	  this._initSortableWidgets();
    },
  _initBuilderPalette: function() {
		// REF: http://www.webresourcesdepot.com/smart-floating-banners/
		$(window).scroll(
		function() {
			if ($(window).scrollTop() > $(".floatingPanelIdentifier").position({scroll : false}).top) {
				$(".floatingPanel").css("position", "fixed");
				$(".floatingPanel").css("top", "0");
			}
			
			if ($(window).scrollTop() <= $(".floatingPanelIdentifier").position({scroll : false}).top) {
				$(".floatingPanel").css("position", "relative");
				$(".floatingPanel").css("top",
						$(".floatingPanelIdentifier").position);
			}
		});
		
		$('#paletteTabs').tabs();
		var widgets = this.options.widgets;
		var length = widgets.length;
		var widgetOptions;
		var widget;
		var i;
	  for (i = 0; i < length; i++) {
		  widgetOptions = $['fb']['fb' + widgets[i]].prototype.options;
		  widget = $('<a id="' + widgetOptions.type +  '" href="#" class="fbWidget">' + widgetOptions.name + '</a>')['fb' + widgetOptions.type]();
      widget.button().appendTo(widgetOptions.belongsTo);
	    }			  
   },
  _initSortableWidgets: function() {
	  var $builderFormFieldset = $(this.options._builderForm);
		$builderFormFieldset.sortable({ 
			axis: 'y',
			cursor: 'move',
			helper: function (event, ui) {
				return $(ui).clone().css({
					opacity: 0.6,
					border: "3px solid #cccccc"
				});
			},
			start: function (event, ui) {
				var $previousElement = $(ui.item).prev();
				if ($previousElement.attr('id')) {
					ui.item.prevId = $previousElement.attr('id');
					ui.item.originalPositionTop = $previousElement.position().top;
					// alert('ui.item.originalPositionTop = ' + ui.item.originalPositionTop);
				}
			},
			update: function (event, ui) {
				var $uiItem = $(ui.item);
				var $elements;
				var moveDown = ui.position.top > ui.item.originalPositionTop;
				$.fb.formbuilder.prototype._log('moveDown = ' + moveDown + ', ui.position.top = ' + ui.position.top + ", ui.item.originalPositionTop = " + ui.item.originalPositionTop);
				if (ui.item.prevId) {
					if (moveDown) {
				    $elements = $uiItem.prevUntil('#' + ui.item.prevId);
				    $.fb.formbuilder.prototype._moveDown($uiItem, $elements);			    
					} else {
						// set next widget's sequence as my sequence
						$.fb.formbuilder.prototype._getSequence($uiItem).val(
						    $.fb.formbuilder.prototype._getSequence($uiItem.next()).val());						
						$elements = $uiItem.nextUntil('#' + ui.item.prevId);  
						$elements.each(function(index) {
						  $.fb.formbuilder.prototype._increaseSequence($(this));
						 });		
						// process the last one
						$.fb.formbuilder.prototype._increaseSequence($('#' + ui.item.prevId));
					}
				} else {
					$elements = $uiItem.prevAll();
					$.fb.formbuilder.prototype._moveDown($uiItem, $elements);			
				}	
			}	
		});
		// Making text elements, or elements that contain text, not text-selectable.
		$builderFormFieldset.disableSelection();	  
  },
	_init: function() {
	  // called on construction and re-initialization
		this._log('FormBuilder._init called.');
		this.method1('calling from FormBuilder._init');
	},        
	destroy: function() {
    // called on removal
		this._log('FormBuilder.destroy called.');

    // call the base destroy function.
		$.Widget.prototype.destroy.call(this);		
    },
  // _logging to the firebug's console, put in 1 line so it can be removed easily for production
  _log: function($message) { if (window.console && window.console.log) window.console.log($message); },
  _moveDown: function($widget, $elements) {
		// set previous widget's sequence as my sequence
		$.fb.formbuilder.prototype._getSequence($widget).val(
		    $.fb.formbuilder.prototype._getSequence($widget.prev()).val());
	  $elements.each(function(index) {
		  $.fb.formbuilder.prototype._decreaseSequence($(this));
	    });	
  }, 
  _getSequence: function($widget) {
    	return $widget.find("input[id$='fields[" + $widget.attr('rel') + "].sequence']");
    },
  _increaseSequence: function($widget) {
	  var $sequence = $.fb.formbuilder.prototype._getSequence($widget);
	  $sequence.val($sequence.val() * 1 + 1);
   },
  _decreaseSequence: function($widget) {
	  var $sequence = $.fb.formbuilder.prototype._getSequence($widget);
	  $sequence.val($sequence.val() - 1);
   },  
	method1: function(params) {
    	// plugin specific method
		this._log('FormBuilder.method1 called. params = ' + params);
    }
};

$.widget('fb.formbuilder', FormBuilder);