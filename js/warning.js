(function ($) {

    'use strict';

    // ---

    var form = $('.warning-form'),
        defaults = {
            container: $('.legal-warning'),
            bodyClass: 'reading-warning',
            fields: form.find('.date-field'),
            error: form.find('.warning-error'),
            form: form,
            date: {
                day: form.find('input[name="dia"]'),
                month: form.find('input[name="mes"]'),
                year: form.find('input[name="ano"]'),
            },
            submit: form.find('.warning-submit')
        };

    // ---

    function Warning($element, settings) {
        this.element = $element;
        this.settings = settings;

        this.init();
    }

    Warning.prototype.init = function () {
        var self, date, submit, fields, $this, index, settings;

        self        = this;
        settings    = self.settings;
        date        = settings.date;
        submit      = settings.submit,
        fields      = settings.fields;

        if (self.cookie().read('warning') == 'show') {
            self.settings.container.hide();
            alert('Congratulations. You have access. Your cookie is active');
        }

        fields.on('keydown', function (e) {
            $this = $(this),
            index = $this.index();

            if (index <= fields.length) {
                if (e.keyCode == 8 && index > 1) {
                    if ($this.val().length == 0) {
                        fields.eq(index - 2).focus();
                    }
                } else {
                    if ($this.val().length == $this.attr('maxlength')) {
                        fields.eq(index).focus();
                    }
                }
            }
        });

        submit.on('click', function (e) {
            e.preventDefault();

            if (date.year.val().length == parseInt(date.year.attr('maxlength')) &&
                date.month.val().length == parseInt(date.month.attr('maxlength')) &&
                date.day.val().length == parseInt(date.day.attr('maxlength'))) {

                self.submit(self.age(date.year, date.month, date.day));
            }
        });

    }

    Warning.prototype.submit = function (age) {
        var container, time, self;

        container = this.settings.container;
        self = this;

        if (age >= 18) {
            self.cookie().create('warning', 'show', 3);

            time = 800;

            container.animate({
                opacity:0
            }, time);

            setTimeout(function(){
                container.stop(true,true).removeAttr('style').addClass('ok');
                $('body').removeClass(self.settings.bodyClass);
            }, time);
        } else {
            alert('Access only 18 year or more.');
        }
    }

    Warning.prototype.age = function (birthYear, birthMonth, birthDay) {
        var today, birthDate, age, m;

        today       = new Date(),
        birthDate   = new Date(birthYear.val(), birthMonth.val()-1, birthDay.val()),
        age         = today.getFullYear() - birthDate.getFullYear(),
        m           = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    Warning.prototype.cookie = function () { 
        var create, read, erase, self;

        self = {};

        self.create = function (name, value, days) {
            var expires, date;

            if (days) {
                date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                expires = "; expires="+date.toGMTString();
            } else {
                expires = "";
            }

            document.cookie = name + "=" + value + expires + "; path=/";

            return true;
        };

        self.read = function (name) {
            var name, ca, c;

            name = name + "=";
            ca = document.cookie.split(';');

            for(var i=0;i < ca.length;i++) {
                c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }

            return null;
        };

        return self;
    }

    $.fn.warning = function (parameters) {

        return this.each(function () {
            var $element, settings, warning;

            $element = $(this);
            settings = $.extend({}, defaults, parameters, $element.data());

            if (!($element.data('plugin-warning') instanceof Comment)) {
                warning = new Warning($element, settings);
            } else {
                console.warn('Warning: already configured (but impossible to '
                    + 'return the instance in group operation)');
            }
        });
    };
}(jQuery));