'use strict';

var _                = require('underscore'),
    $                = require('jquery'),
    View             = require('../../app_view_chaplin'),
    template         = require('../../../templates/partials/analytics/filters.hbs'),
    DropdownView     = require('./dropdown.js'),
    CardView         = require('./card.js'),
    CardSelectedView = require('./card_selected'),
    btn              = require('../../../templates/partials/btn.hbs'),
    Feature          = require('../../../libs/feature'),
    utils            = require('../../../libs/utils'),
    moment           = require('moment');


// Stash all selectors for easy updating. Please alias all
// dom elements using this pattern. When a DOM element changes name
// you only need to update it in one place.
var els = {
    btn: '.card-btn',
    btnWrap: '#btn_wrap',
    countryBtn: '#country_ids_wrap .dropdown__toggle',
    dateShifters: '.date-shift',
    dimWrap: '#dim_wrap',
    from_date: '#from_date',
    to_date: '#to_date',
    // remove shareUrlMessage variable on tear down of analytics_export feature
    shareUrlMessage: '#share_url_message',
    // remove shareUrl variable on tear down of analytics_export feature
    shareUrl: '#share_url',
    shareButton: '#share_button',
    viewByButtons: '#btn_wrap .card-btn'
},
dateFields = ['from_date', 'to_date'],

// The dateFormat will be used in the jQuery-UI datepicker
dateFormatPicker = 'yy-mm-dd';


// Should probably be refactored so that the card- and dropdown- specific
// logic is moved to the card and dropdown views.
var FiltersView = View.extend({
    region: 'filters',
    template: template,

    // Events hash. Backbone attribute.
    events: {
        'click .date-shift': 'dateShift',
        'click .card-btn': 'showCards',
        // remove 'click #share_button' event on tear down of analytics_export feature
        'click #share_button': 'toggleShareBtn',
        'change #to_date, #from_date': 'disableActiveTab'
    },
    showSelectedFilter: function() {
        var selectedFilter = this.model.getSelectedFilter(),
            selectedFilterName = (selectedFilter && selectedFilter.name) || 'vendor';

        // country_ids, artist_ids, etc. are stored on the analytics model. If
        // any of them are selected, resize their cards. If no filter is selected
        // default to the vendor card.
        _.each(this.model.get(selectedFilterName), this.sizeCard, this);

        this.$(els.viewByButtons + '[data-card="' + selectedFilterName + '"]').addClass('active');
        var id = this.getCardWrapEl(selectedFilterName),
            elIds = this.model.cardFilterNames.concat(['vendor']);
        _.each(elIds, function(el) {
            this.getCardWrapEl(el).addClass('hidden');
        }, this);
        this.$(id).removeClass('hidden');
    },
    // A Collection bubbles up all events from its models. In this case the
    // `change:selected` event comes from setting the `selected` attribute on
    // the models in each of the filter collections.
    // 1. Call the view init parent.
    // 2. Set the user. The user data is initially passed from the Zend phtml page. The user model
    // then periodically pages the server to see if the user is logged in.
    // 3. Cycle through the filters and listen for any changes to the `selected` attr of the models.
    initialize: function (options) {
        View.prototype.initialize.apply(this, arguments);
        this.model.set('analyticsExportEnabled', Feature.isEnabled('analytics_export', 'enabled'));
        // Check to see if a filter has been applied and set the class
        // of that view_by. Each filter is a Collection, so events triggered on
        // its models bubble up as event on the collection (i.e. change:selected.)
        _.each(this.model.filters, function (filter) {
            this.listenTo(filter, 'change:selected', this.addFilter);
            this.listenTo(filter, 'change:selected', this.toggleCountries);
        }, this);

        this.listenTo(this.model, 'change:breakdown_by', this.render);
    },
    // Render out the page after called the parent method.
    render: function () {
        View.prototype.render.apply(this, arguments);
        this.renderDropdowns(DropdownView, this.model.dropdownFilters);
        this.renderDropdowns(CardView, this.model.cardFilters);
        this.renderSelectedCards();
        this.renderDatePickers();
        this.renderVendorCard();
        this.showSelectedFilter();
    },

    // Get the data to render the page's buttons.
    // Why not hardcode this in the template? We are aliasing the names of our dropdowns and cards
    // so that if the names change, we can update the name throughout the app. The collection's `name`
    // and `title` attributes are what we need.
    getTemplateData: function() {
        var data = View.prototype.getTemplateData.call(this);
        var usrType = this.model.user.get('userType');
        var filteredList = this.model.cardFilters;

        if (usrType !== 'distributionVendor') {
            filteredList = _.without(filteredList, _.findWhere(filteredList, {name: 'subaccount_ids'}));
        }

        if (!this.model.user.get('isAudioUser')) {
            // Removing Track filter for non-audio users (i.e. Film or TV)
            filteredList = _.without(filteredList, _.findWhere(filteredList, {title: 'Tracks'}));
        }
        
        if (Feature.isEnabled('analytics_product_code', 'enabled') && !this.model.user.get('isAudioUser')) {
            // Removing Product filter for non-audio users (i.e. Film or TV)
            filteredList = _.without(filteredList, _.findWhere(filteredList, {title: 'Products'}));
        }

        // Remapping Audio terminology to Film/TV (if not already remapped)
        //     For Both
        //     'Imprints' => 'Studios'
        //     For Film
        //     'Artists'  => 'Collections'
        //     For TV
        //     'Artists'  => 'Volumes'
        if (this.model.user.get('isFilmUser')) {
            utils.replaceValue(filteredList, 'title', ['Imprints', 'Studios'], ['Artists', 'Collections']);
        } else if (this.model.user.get('isTVUser')) {
            utils.replaceValue(filteredList, 'title', ['Imprints', 'Studios'], ['Artists', 'Volumes']);
        }

        data.filters = [{name: 'vendor', title: 'All', userType: usrType}].concat(filteredList);
        data.allmonths = this.model.allTimeAnalyticsMonths;
        data.breakdown_by = this.model.get('breakdown_by');
        return data;
    },
    // We may enter with already selected cards (from the top downloads list on
    // Index page, e.g.). We want to statelessly render those selected cards so
    // that it doesn't require a `change` event to set them up.
    renderSelectedCards: function() {
        _.each(this.model.cardFilters, function(filter) {
            _.each(filter.where({selected: true}), this.renderCard, this);
        }, this);
    },
    // Render a card. When a model's `selected` attribute is changed, this method is called.
    // The model's collection name holds the name of the card. The el's `id`
    // is formed from this cardName and the model id. If the model is selected, then render the card.
    // If the model is not selected, remove it. Then resize the cards.
    renderCard: function (model) {
        var cardName = model.getSourceAttribute();
        if (model.get('selected')) {
            this.subview(model.cid, new CardSelectedView({
                container: this.getLastCardEl(cardName),
                containerMethod:'before',
                id: cardName + '_' + model.id,
                title: model.get(model.nameAttribute),
                model: model,
                showAllText: false
            }));
            //Select the correct filter group button
            this.$(els.btn).removeClass('active');
            this.$(els.btn + '.' + cardName).addClass('active');
            //Remove the vendor card and display the current card wrap
            this.getCardWrapEl('vendor').addClass('hidden');
            this.getCardWrapEl(cardName).removeClass('hidden');
        } else {
            var view = this.subview(model.cid);
            if (!view) return;
            view.dispose();
        }

        var count = model.collection.where({selected: true}).length;
        this.sizeCard(cardName, count);
    },
    // Render the date pickers using jQuery UI.
    renderDatePickers: function () {
        _.each(dateFields, function(field) {
            var dateValue = this.model.get(field);
            this.$(els[field]).datepicker({
                dateFormat: dateFormatPicker,
                defaultDate: dateValue
            }).val(dateValue);
        }, this);
        return this;
    },
    // Renders both the cards and the dropdowns. Called in init.
    // The specific view and filters are passed ads arguments.
    renderDropdowns: function (ViewClass, filters) {
        _.each(filters, function(filter) {
            new ViewClass({
                container: this.getCardWrapEl(filter.name),
                collection: filter
            });
        }, this);
    },
    renderVendorCard: function() {
        new CardSelectedView({
            container: this.getCardWrapEl('vendor'),
            title: this.model.user.get('company'),
            showClose: false,
            defaultCardSubtext: this.getDefaultCardSubtext()
        });
        this.addCardSizeClass(this.getCardWrapEl('vendor'));
    },
    // Helper function to get the container element for the card by name
    getCardWrapEl: function (cardName) {
        return this.$('#' + cardName + '_wrap');
    },
    // function returns last child of wrapper
    getLastCardEl: function (cardName) {
        var cardWraper = this.getCardWrapEl(cardName);
        return cardWraper.children().last();
    },
    // Determine whether to show 'All Volumes', 'All Collections' or 'All Artists' on the 'View By: All' for the card
    getDefaultCardSubtext: function() {
        if (this.model.user.get('isFilmUser')) {
            return 'Collections';
        } else if (this.model.user.get('isTVUser')) {
            return 'Volumes';
        } else {
            return 'Artists';
        }
    },
    // Called when a filter option changes from selected to unselected or vice-
    // versa. We keep the selected ids in sync between the model and the graphs.
    addFilter: function (model) {
        var attr = model.getSourceAttribute(),
            ids = this.model.graphs.getAttribute(attr) || [],
            model_id = model.get('source_type_id') || model.id;
        //For now we must use the source_type_id for sources due to conflicting social/store ids
        model.get('selected') ? ids.push(model_id) : ids.splice(ids.indexOf(model_id, 1));
        this.model.set(attr, ids);
        this.model.graphs.setAttributes(attr, ids);
        if(_.contains(this.model.cardFilterNames, attr)) this.renderCard(model);
    },
    clearCardFilters: function() {
        _.each(this.model.cardFilters, function(filter) {
            _.invoke(filter.models, 'set', {selected: false});
        });
    },
    // Used by the date shifter. Grabs the number of months to shift from the DOM.
    dateShift: function (e) {
        alert('dateShift');
        var shift = this.$(e.target).data('month'),
            to_date = this.$(els.to_date).val(),
            from_date = moment(to_date).subtract('months', shift).add('days', 1).format(this.model.dateFormat);
        this.$(els.from_date).val(from_date);
        this.toggleDateShift(e);
        // if (Feature.isEnabled('alw_segment', 'enabled')) {
            analytics.track('Analytics Overview', {
                category: 'Analytics Overview',
                action: 'Calendar',
                label: shift + ' Month'
            });
        // } else {
            // ga('send', 'event', 'Analytics Overview', 'Calendar', shift + ' Month');
        // }
    },
    // This should be refactored out when we get rid of sizeCard to something like flexbox.
    addCardSizeClass: function(el, size) {
        el.addClass('card-' + (size || 1));
    },
    // Add a class to our cards to allow us to correctly style them (setting width
    // mostly.)
    sizeCard: function (cardName, len) {
        var wrapEl = this.getCardWrapEl(cardName)
            .removeClass(function(index, css) {
                return (css.match (/\bcard-\S+/) || []).join(' ');
            });
        this.addCardSizeClass(wrapEl, len + 1);
    },
    // Reveal a row of cards.
    showCards: function (e) {
        alert('showCards');
        this.clearCardFilters();
        var id = this.getCardWrapEl($(e.target).data('card')),
            elIds = this.model.cardFilterNames.concat(['vendor']);
        _.each(elIds, function(el) {
            this.getCardWrapEl(el).addClass('hidden');
        }, this);
        this.$(els.btn).removeClass('active');
        $(e.target).addClass('active');
        this.$(id).removeClass('hidden');
        // if (Feature.isEnabled('alw_segment', 'enabled')) {
            analytics.track('Analytics Overview', {
                category: 'Analytics Overview',
                action: 'View By',
                label: $(e.target).data('card')
            });
        // } else {
        //     ga('send', 'event', 'Analytics Overview', 'View By',  $(e.target).data('card'));
        // }

    },
    toggleCountries: function (filter) {
        //If and only if a social source is selected without a store source, disable the country dropdown
        if (this.model.get('social_media_ids') && this.model.get('social_media_ids').length) {
            if (!this.model.get('store_ids') || this.model.get('store_ids').length === 0) {
                this.$(els.countryBtn).attr('disabled', 'disabled');
            } else {
                this.$(els.countryBtn).removeAttr('disabled');
            }
        } else {
            this.$(els.countryBtn).removeAttr('disabled');
        }
    },
    toggleDateShift: function (e){
        this.$(els.dateShifters).removeClass('active');
        $(e.target).addClass('active');
    },
    // remove toggleShareBtn function on tear down of analytics_export feature
    // Toggle for share button.
    toggleShareBtn: function (e){
        e.preventDefault();
        var text = this.$(els.shareButton).text();
        if (this.$(els.shareUrlMessage).is(':hidden')) {
            this.$(els.shareUrl).val(window.location.href);
        }
        this.$(els.shareButton).text(text === 'Share' ? 'Close' : 'Share');
        this.$(els.shareUrlMessage).slideToggle();
        if (Feature.isEnabled('alw_segment', 'enabled')) {
            analytics.track('Analytics Overview', {
                category: 'Analytics Overview',
                action: 'Share Button',
                label: (text === 'Share' ? 'Share' : 'Close')
            });
        } else {
            ga('send', 'event', 'Analytics Overview', 'Share Button', (text === 'Share' ? 'Share' : 'Close'));
        }
    },
    // Apply changes to the model and graphs when the user clicks "apply."
    update: function () {
        _.each(dateFields, function(field) {
            var val = this.$(els[field]).val();
            if (!val) return;
            this.model.set(field, val);
        }, this);
    },
    // Disable highlighted tab when user selects custom date
    disableActiveTab: function(e) {
        alert('disableActiveTab');
        this.$(els.dateShifters).removeClass('active');
        // if (Feature.isEnabled('alw_segment', 'enabled')) {
            analytics.track('Analytics Overview', {
                category: 'Analytics Overview',
                action: 'Calendar',
                label: $(e.target).attr('id')
            });
        // } else {
        //     ga('send', 'event', 'Analytics Overview', 'Calendar', $(e.target).attr('id'));
        // }
    }
});

module.exports = FiltersView;
