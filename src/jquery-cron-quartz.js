


;(function($) {
    "use strict";

    var cronInputs = $.fn.cronInputs = {
        'en': {
            period: '<div class="cron-select-period"><label></label><select class="cron-period-select"></select></div>',
            startTime: '<div class="cron-input cron-start-time">Start time <select class="cron-clock-hour"></select>:<select class="cron-clock-minute"></select>:<select class="cron-clock-second"></select></div>',
            container: '<div class="cron-input"></div>',
            seconds: {
                tag: 'cron-seconds',
                inputs: [ '<p>Every <select class="cron-seconds-select"></select> seconds(s)</p>' ]
            },
            minutes: {
                tag: 'cron-minutes',
                inputs: [ '<p>Every <select class="cron-minutes-select"></select> minutes(s)</p>' ]
            },
            hourly: {
                tag: 'cron-hourly',
                inputs: [ '<p><input type="radio" name="hourlyType" value="every"> Every <select class="cron-hourly-select"></select> hour(s)</p>',
                    '<p><input type="radio" name="hourlyType" value="clock"> Every day at <select class="cron-hourly-hour"></select>:<select class="cron-hourly-minute"></select>:<select class="cron-hourly-second"></select></p>']
            },
            daily: {
                tag: 'cron-daily',
                inputs: [ '<p><input type="radio" name="dailyType" value="every"> Every <select class="cron-daily-select"></select> day(s)</p>',
                    '<p><input type="radio" name="dailyType" value="clock"> Every week day</p>']
            },
            weekly: {
                tag: 'cron-weekly',
                inputs: [ '<p><input type="checkbox" name="dayOfWeekMon"> Monday  <input type="checkbox" name="dayOfWeekTue"> Tuesday  '+
                '<input type="checkbox" name="dayOfWeekWed"> Wednesday  <input type="checkbox" name="dayOfWeekThu"> Thursday</p>',
                    '<p><input type="checkbox" name="dayOfWeekFri"> Friday  <input type="checkbox" name="dayOfWeekSat"> Saturday  '+
                    '<input type="checkbox" name="dayOfWeekSun"> Sunday</p>' ]
            },
            monthly: {
                tag: 'cron-monthly',
                inputs: [ '<p><input type="radio" name="monthlyType" value="byDay"> Day <select class="cron-monthly-day"></select> of every <select class="cron-monthly-month"></select> month(s)</p>',
                    '<p><input type="radio" name="monthlyType" value="byWeek"> The <select class="cron-monthly-nth-day"></select> ' +
                    '<select class="cron-monthly-day-of-week"></select> of every <select class="cron-monthly-month-by-week"></select> month(s)</p>']
            },
            yearly: {
                tag: 'cron-yearly',
                inputs: [ '<p><input type="radio" name="yearlyType" value="byDay"> Every <select class="cron-yearly-month"></select> <select class="cron-yearly-day"></select></p>',
                    '<p><input type="radio" name="yearlyType" value="byWeek"> The <select class="cron-yearly-nth-day"></select> ' +
                    '<select class="cron-yearly-day-of-week"></select> of <select class="cron-yearly-month-by-week"></select></p>']
            }
        }
    };

    var optsText = $.fn.optsText = {
        'en': {
            periodOpts:    ["Seconds", "Minutes", "Hourly", "Daily", "Weekly", "Monthly", "Yearly"],
            monthOpts:     ["January","February","March","April","May","June","July","August","September","October","November","December"],
            nthWeekOpts:   ["First", "Second", "Third", "Forth"],
            dayOfWeekOpts: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday", "Sunday"]
        }
    };

    // Convert an array of values to options to append to select input
    function arrayToOptions(opts, values) {
        var inputOpts='';
        for (var i = 0; i < opts.length; i++) {
            var value=opts[i];
            if(values!=null) value=values[i];
            inputOpts += "<option value='"+value+"'>" + opts[i] + "</option>\n";

        }
        return inputOpts;
    }

    // Convert an integer range to options to append to select input
    function rangeToOptions(start, end, isClock) {
        var inputOpts='', label;
        for (var i = start; i <= end; i++) {
            if(isClock && i < 10) label = "0" + i;
            else label = i;
            inputOpts += "<option value='"+i+"'>" + label + "</option>\n";
        }
        return inputOpts;
    }

    // Add input elements to UI as defined in cronInputs
    function addInputElements($baseEl, inputObj, language, onFinish) {
        $(cronInputs[language].container).addClass(inputObj.tag).appendTo($baseEl);
        $baseEl.children("."+inputObj.tag).append(inputObj.inputs);
        if(typeof onFinish === "function") onFinish();
    }

    var eventHandlers={
        periodSelect: function() {
            var period=($(this).val());
            var $selector=$(this).parent();
            $selector.siblings('div.cron-input').hide();
            $selector.siblings().find("select option").removeAttr("selected");
            $selector.siblings().find("select option:first").attr("selected", "selected");
            $selector.siblings('div.cron-start-time').show();
            $selector.siblings('div.cron-start-time').children("select.cron-clock-hour").val('12');
            switch(period) {
                case 'Seconds':
                    $selector.siblings('div.cron-seconds')
                        .show()
                        .find("select.cron-seconds-select").val('1');
                    $selector.siblings('div.cron-start-time').hide();
                    break;
                case 'Minutes':
                    $selector.siblings('div.cron-minutes')
                        .show()
                        .find("select.cron-minutes-select").val('1');
                    $selector.siblings('div.cron-start-time').hide();
                    break;
                case 'Hourly':
                    var $hourlyEl=$selector.siblings('div.cron-hourly');
                    $hourlyEl.show()
                        .find("input[name=hourlyType][value=every]").prop('checked', true);
                    $hourlyEl.find("select.cron-hourly-hour").val('12');
                    $selector.siblings('div.cron-start-time').hide();
                    break;
                case 'Daily':
                    var $dailyEl=$selector.siblings('div.cron-daily');
                    $dailyEl.show()
                        .find("input[name=dailyType][value=every]").prop('checked', true);
                    break;
                case 'Weekly':
                    $selector.siblings('div.cron-weekly')
                        .show()
                        .find("input[type=checkbox]").prop('checked', false);
                    break;
                case 'Monthly':
                    var $monthlyEl=$selector.siblings('div.cron-monthly');
                    $monthlyEl.show()
                        .find("input[name=monthlyType][value=byDay]").prop('checked', true);
                    break;
                case 'Yearly':
                    var $yearlyEl=$selector.siblings('div.cron-yearly');
                    $yearlyEl.show()
                        .find("input[name=yearlyType][value=byDay]").prop('checked', true);
                    break;
            }
        }
    };

    // Public functions
    $.cronBuilder = function(el, options) {
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el=$(el);
        base.el=el;

        // Reverse reference to the DOM object
        base.$el.data('cronBuilder', base);

        // Initialization
        base.init = function() {
            base.options = $.extend({},$.cronBuilder.defaultOptions, options);

            var periodOpts=arrayToOptions(optsText[base.options.language].periodOpts, ["Seconds", "Minutes", "Hourly", "Daily", "Weekly", "Monthly", "Yearly"]);
            var secondOpts=rangeToOptions(1, 60);
            var minuteOpts=rangeToOptions(1, 60);
            var hourOpts=rangeToOptions(1, 24);
            var dayOpts=rangeToOptions(1, 100);
            var secondClockOpts=rangeToOptions(0, 59, true);
            var minuteClockOpts=rangeToOptions(0, 59, true);
            var hourClockOpts=rangeToOptions(0, 23, true);
            var dayInMonthOpts=rangeToOptions(1, 31);
            var monthOpts=arrayToOptions(optsText[base.options.language].monthOpts,
                [1,2,3,4,5,6,7,8,9,10,11,12]);
            var monthNumOpts=rangeToOptions(1, 12);
            var nthWeekOpts=arrayToOptions(optsText[base.options.language].nthWeekOpts, [1,2,3,4]);
            var dayOfWeekOpts=arrayToOptions(optsText[base.options.language].dayOfWeekOpts, ["MON","TUE","WED","THU","FRI","SAT", "SUN"]);

            base.$el.append(cronInputs[base.options.language].period);
            base.$el.find("div.cron-select-period label").text(base.options.selectorLabel);
            base.$el.find("select.cron-period-select")
                .append(periodOpts)
                .bind("change", eventHandlers.periodSelect);

            addInputElements(base.$el, cronInputs[base.options.language].seconds, base.options.language, function() {
                base.$el.find("select.cron-seconds-select").append(secondOpts);
            });

            addInputElements(base.$el, cronInputs[base.options.language].minutes, base.options.language, function() {
                base.$el.find("select.cron-minutes-select").append(minuteOpts);
            });

            addInputElements(base.$el, cronInputs[base.options.language].hourly, base.options.language, function() {
                base.$el.find("select.cron-hourly-select").append(hourOpts);
                base.$el.find("select.cron-hourly-hour").append(hourClockOpts);
                base.$el.find("select.cron-hourly-minute").append(minuteClockOpts);
                base.$el.find("select.cron-hourly-second").append(secondClockOpts);
            });

            addInputElements(base.$el, cronInputs[base.options.language].daily, base.options.language, function() {
                base.$el.find("select.cron-daily-select").append(dayOpts);
            });

            addInputElements(base.$el, cronInputs[base.options.language].weekly, base.options.language);

            addInputElements(base.$el, cronInputs[base.options.language].monthly, base.options.language, function() {
                base.$el.find("select.cron-monthly-day").append(dayInMonthOpts);
                base.$el.find("select.cron-monthly-month").append(monthNumOpts);
                base.$el.find("select.cron-monthly-nth-day").append(nthWeekOpts);
                base.$el.find("select.cron-monthly-day-of-week").append(dayOfWeekOpts);
                base.$el.find("select.cron-monthly-month-by-week").append(monthNumOpts);
            });

            addInputElements(base.$el, cronInputs[base.options.language].yearly, base.options.language, function() {
                base.$el.find("select.cron-yearly-month").append(monthOpts);
                base.$el.find("select.cron-yearly-day").append(dayInMonthOpts);
                base.$el.find("select.cron-yearly-nth-day").append(nthWeekOpts);
                base.$el.find("select.cron-yearly-day-of-week").append(dayOfWeekOpts);
                base.$el.find("select.cron-yearly-month-by-week").append(monthOpts);
            });


            base.$el.append(cronInputs[base.options.language].startTime);
            base.$el.find("select.cron-clock-hour").append(hourClockOpts);
            base.$el.find("select.cron-clock-minute").append(minuteClockOpts);
            base.$el.find("select.cron-clock-second").append(secondClockOpts);

            if(typeof base.options.onChange === "function") {
                base.$el.find("select, input").change(function() {
                    base.options.onChange(base.getExpression());
                });
            }

            base.$el.find("select.cron-period-select")
                .triggerHandler("change");

        }

        base.getExpression = function() {
            //var b = c.data("block");
            var sec = 0; // ignoring seconds by default
            var year = "*"; // every year by default
            var dow = "?";
            var month ="*", dom = "*";
            var sec=base.$el.find("select.cron-clock-second").val();
            var min=base.$el.find("select.cron-clock-minute").val();
            var hour=base.$el.find("select.cron-clock-hour").val();
            var period = base.$el.find("select.cron-period-select").val();
            switch (period) {
                case 'Seconds':
                    var $selector=base.$el.find("div.cron-seconds");
                    var nsec=$selector.find("select.cron-seconds-select").val();
                    if(nsec > 1) sec ="0/"+nsec;
                    else sec="*";
                    min="*";
                    hour="*";
                    break;

                case 'Minutes':
                    var $selector=base.$el.find("div.cron-minutes");
                    var nmin=$selector.find("select.cron-minutes-select").val();
                	if(nmin > 1) min ="0/"+nmin;
                	else min="*";
                	hour="*";
                    break;

                case 'Hourly':
                    var $selector=base.$el.find("div.cron-hourly");
                    if($selector.find("input[name=hourlyType][value=every]").is(":checked")){
                        min=0;
                        hour="*";
                        var nhour=$selector.find("select.cron-hourly-select").val();
                    	if(nhour > 1) hour ="0/"+nhour;
                    } else {
                        sec=$selector.find("select.cron-hourly-second").val();
                        min=$selector.find("select.cron-hourly-minute").val();
                        hour=$selector.find("select.cron-hourly-hour").val();
                    }
                    break;

                case 'Daily':
                    var $selector=base.$el.find("div.cron-daily");
                    if($selector.find("input[name=dailyType][value=every]").is(":checked")){
                        var ndom=$selector.find("select.cron-daily-select").val();
                        if(ndom > 1) dom ="1/"+ndom;
                    } else {
                        dom="?";
                        dow="MON-FRI";
                    }
                    break;

                case 'Weekly':
                    var $selector=base.$el.find("div.cron-weekly");
                    var ndow=[];
                    if($selector.find("input[name=dayOfWeekMon]").is(":checked"))
                        ndow.push("MON");
                    if($selector.find("input[name=dayOfWeekTue]").is(":checked"))
                        ndow.push("TUE");
                    if($selector.find("input[name=dayOfWeekWed]").is(":checked"))
                        ndow.push("WED");
                    if($selector.find("input[name=dayOfWeekThu]").is(":checked"))
                        ndow.push("THU");
                    if($selector.find("input[name=dayOfWeekFri]").is(":checked"))
                        ndow.push("FRI");
                    if($selector.find("input[name=dayOfWeekSat]").is(":checked"))
                        ndow.push("SAT");
                    if($selector.find("input[name=dayOfWeekSun]").is(":checked"))
                        ndow.push("SUN");
                    dow="*";
                    dom="?";
                    if(ndow.length < 7 && ndow.length > 0) dow=ndow.join(",");
                    break;

                case 'Monthly':
                    var $selector=base.$el.find("div.cron-monthly");
                    var nmonth;
                    if($selector.find("input[name=monthlyType][value=byDay]").is(":checked")){
                        month="*";
                        nmonth=$selector.find("select.cron-monthly-month").val();
                        dom=$selector.find("select.cron-monthly-day").val();
                        dow="?";
                    } else {
                        dow=$selector.find("select.cron-monthly-day-of-week").val()
                            +"#"+$selector.find("select.cron-monthly-nth-day").val();
                        nmonth=$selector.find("select.cron-monthly-month-by-week").val();
                        dom="?";
                    }
                    if(nmonth > 1) month ="1/"+nmonth;
                    break;

                case 'Yearly':
                    var $selector=base.$el.find("div.cron-yearly");
                    if($selector.find("input[name=yearlyType][value=byDay]").is(":checked")){
                        dom=$selector.find("select.cron-yearly-day").val();
                        month=$selector.find("select.cron-yearly-month").val();
                        dow="?";
                    } else {
                        dow=$selector.find("select.cron-yearly-day-of-week").val()
                            +"#"+$selector.find("select.cron-yearly-nth-day").val();
                        month=$selector.find("select.cron-yearly-month-by-week").val();
                        dom="?";
                    }
                    break;

                default:
                    break;
            }
            return [sec, min, hour, dom, month, dow, year].join(" ");
        };
		
		base.parseExpression = function(exp) {
			var subexps = exp.split(' ');
			
			if (subexps[0] == '*' || subexps[0].indexOf('0/') == 0) {
				base.$el.find("select.cron-period-select option[value=Seconds]").prop('selected', 'selected').change();
				
				var every = 1;
				if (subexps[0].indexOf('0/') == 0) {
					every = subexps[0].split('/')[1];
				}
				
				base.$el.find("select.cron-seconds-select option[value=" + every + "]").prop('selected', 'selected').change();
			}
			else if (subexps[1] == '*' || subexps[1].indexOf('0/') == 0) {
				base.$el.find("select.cron-period-select option[value=Minutes]").prop('selected', 'selected').change();
				
				var every = 1;
				if (subexps[1].indexOf('0/') == 0) {
					every = subexps[1].split('/')[1];
				}
				
				base.$el.find("select.cron-minutes-select option[value=" + every + "]").prop('selected', 'selected').change();
			}
			else if (subexps[2] == '*' || subexps[2].indexOf('0/') == 0 || subexps[3] == '*') {
				base.$el.find("select.cron-period-select option[value=Hourly]").prop('selected', 'selected').change();
				
				if (subexps[2] == '*' || subexps[2].indexOf('0/') == 0) {
					base.$el.find("input[name=hourlyType][value=every]").prop('checked', true);
					
					var every = 1;
					if (subexps[2].indexOf('0/') == 0) {
						every = subexps[2].split('/')[1];
					}
					
					base.$el.find("select.cron-hourly-select option[value=" + every + "]").prop('selected', 'selected').change();
				}
				else {
					base.$el.find("input[name=hourlyType][value=clock]").prop('checked', true);
					
					base.$el.find("select.cron-hourly-hour option[value=" + subexps[2] + "]").prop('selected', 'selected').change();
					base.$el.find("select.cron-hourly-minute option[value=" + subexps[1] + "]").prop('selected', 'selected').change();
					base.$el.find("select.cron-hourly-second option[value=" + subexps[0] + "]").prop('selected', 'selected').change();
				}
			}
			else {
				if (subexps[2].indexOf('1/') == 0 || subexps[5] == 'MON-FRI') {
					base.$el.find("select.cron-period-select option[value=Daily]").prop('selected', 'selected').change();
					
					if (subexps[5] == 'MON-FRI') {
						base.$el.find("input[name=dailyType][value=clock]").prop('checked', true);
					}
					else {
						base.$el.find("input[name=dailyType][value=every]").prop('checked', true);
						
						var every = 1;
						if (subexps[3].indexOf('1/') == 0) {
							every = subexps[3].split('/')[1];
						}
						
						base.$el.find("select.cron-daily-select option[value=" + every + "]").prop('selected', 'selected').change();
					}
				}
				else if (subexps[5] == '*' || (subexps[5] != '?' && subexps[5].indexOf('#') == -1)) {
					base.$el.find("select.cron-period-select option[value=Weekly]").prop('selected', 'selected').change();
					
					if (subexps[5] != '*') {
						var weekdays = subexps[5].split(',');
						base.$el.find(".cron-weekly input[type=checkbox]").prop('checked', false);
						for (var i in weekdays) {
							base.$el.find(".cron-weekly input[name=dayOfWeek" + weekdays[i].charAt(0).toUpperCase() + weekdays[i].toLowerCase().slice(1) + "]").prop('checked', true);
						}
					}
				}
				else if (subexps[4] == '*' || subexps[4].indexOf('1/') == 0) {
					base.$el.find("select.cron-period-select option[value=Monthly]").prop('selected', 'selected').change();
					
					var every = 1;
					if (subexps[4].indexOf('1/') == 0) {
						every = subexps[4].split('/')[1];
					}
					
					if (subexps[3] != '?') {
						base.$el.find("input[name=monthlyType][value=byDay]").prop('checked', true);
						base.$el.find("select.cron-monthly-month option[value=" + every + "]").prop('selected', 'selected').change();
						base.$el.find("select.cron-monthly-day option[value=" + subexps[3] + "]").prop('selected', 'selected').change();
					}
					else {
						base.$el.find("input[name=monthlyType][value=byWeek]").prop('checked', true);
						base.$el.find("select.cron-monthly-month-by-week option[value=" + every + "]").prop('selected', 'selected').change();
						
						var weekday = subexps[5].split('#')[0],
							nthDay = subexps[5].split('#')[1];
						
						base.$el.find("select.cron-monthly-day-of-week option[value=" + weekday + "]").prop('selected', 'selected').change();
						base.$el.find("select.cron-monthly-nth-day option[value=" + nthDay + "]").prop('selected', 'selected').change();
					}
				}
				else {
					base.$el.find("select.cron-period-select option[value=Yearly]").prop('selected', 'selected').change();
					
					if (subexps[3] != '?') {
						base.$el.find("input[name=yealyType][value=byDay]").prop('checked', true);
						base.$el.find("select.cron-yearly-month option[value=" + subexps[4] + "]").prop('selected', 'selected').change();
						base.$el.find("select.cron-yearly-day option[value=" + subexps[3] + "]").prop('selected', 'selected').change();
					}
					else {
						base.$el.find("input[name=yearlyType][value=byWeek]").prop('checked', true);
						base.$el.find("select.cron-yearly-month-by-week option[value=" + subexps[4] + "]").prop('selected', 'selected').change();
						
						var weekday = subexps[5].split('#')[0],
							nthDay = subexps[5].split('#')[1];
						
						base.$el.find("select.cron-yearly-day-of-week option[value=" + weekday + "]").prop('selected', 'selected').change();
						base.$el.find("select.cron-yearly-nth-day option[value=" + nthDay + "]").prop('selected', 'selected').change();
					}
				}
				
				base.$el.find("select.cron-clock-hour option[value=" + subexps[2] + "]").prop('selected', 'selected').change();
				base.$el.find("select.cron-clock-minute option[value=" + subexps[1] + "]").prop('selected', 'selected').change();
				base.$el.find("select.cron-clock-second option[value=" + subexps[0] + "]").prop('selected', 'selected').change();
			}
		};

        base.init();
    };

    // Plugin default options
    $.cronBuilder.defaultOptions = {
        selectorLabel: "Select period: ",
        language: "en"
    };

    // Plugin definition
    $.fn.cronBuilder = function(options) {
        return this.each(function(){
            (new $.cronBuilder(this, options));
        });
    };

}( jQuery ));