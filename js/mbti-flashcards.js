/**
 * MBTI Flashcards v1.0.0
 *
 * Copyright 2015 Steven Pease
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
(function(exports) {
    /**
     * All 16 MBTI personality types and their corresponding cognitive functions
     * in listed in descending-order pertaining to how strong each one is. Format:
     * <pre>{
     *  String: Array<String>, // The MBTI type => Each cognitive function listed in descending-order pertaining to how strong each one is
     *  ... // The remaining MBTI types
     * }</pre>
     * @var {Object<String,Array<String>>}
     */
    var types = {
        'INTP': ['Ti', 'Ne', 'Si', 'Fe', 'Te', 'Ni', 'Se', 'Fi'],
        'ISTP': ['Ti', 'Se', 'Ni', 'Fe', 'Te', 'Si', 'Ne', 'Fi'],
        'ESTP': ['Se', 'Ti', 'Fe', 'Ni', 'Si', 'Te', 'Fi', 'Ne'],
        'ESFP': ['Se', 'Fi', 'Te', 'Ni', 'Si', 'Fe', 'Ti', 'Ne'],
        'ISFP': ['Fi', 'Se', 'Ni', 'Te', 'Fe', 'Si', 'Ne', 'Ti'],
        'INFP': ['Fi', 'Ne', 'Si', 'Te', 'Fe', 'Ni', 'Se', 'Ti'],
        'ENFP': ['Ne', 'Fi', 'Te', 'Si', 'Ni', 'Fe', 'Ti', 'Se'],
        'ENTP': ['Ne', 'Ti', 'Fe', 'Si', 'Ni', 'Te', 'Fi', 'Se'],
        'ENTJ': ['Te', 'Ni', 'Se', 'Fi', 'Ti', 'Ne', 'Si', 'Fe'],
        'ESTJ': ['Te', 'Si', 'Ne', 'Fi', 'Ti', 'Se', 'Ni', 'Fe'],
        'ISTJ': ['Si', 'Te', 'Fi', 'Ne', 'Se', 'Ti', 'Fe', 'Ni'],
        'ISFJ': ['Si', 'Fe', 'Ti', 'Ne', 'Se', 'Fi', 'Te', 'Ni'],
        'ESFJ': ['Fe', 'Si', 'Ne', 'Ti', 'Fi', 'Se', 'Ni', 'Te'],
        'ENFJ': ['Fe', 'Ni', 'Se', 'Ti', 'Fi', 'Ne', 'Si', 'Te'],
        'INFJ': ['Ni', 'Fe', 'Ti', 'Se', 'Ne', 'Fi', 'Te', 'Si'],
        'INTJ': ['Ni', 'Te', 'Fi', 'Se', 'Ne', 'Ti', 'Fe', 'Si']
    };
    
    /**
     * @var {Object}
     */
    var MbtiTypes = {
        /**
         * @return {Object} Structured data concerning all the MBTI types. Format:
         * <pre>{
         *  String: Array<String>, // The MBTI type => Each cognitive function listed in descending-order pertaining to how strong each one is
         *  ... // The remaining MBTI types
         * }</pre>
         */
        getTypesData: function() {
            return Object.assign({}, types);
        },
        
        /**
         * @param {String} type The MBTI type
         * @return {Array<String>} The provided MBTI type's cognitive function listed in descending-order pertaining to how strong each one is
         */
        getTypeData: function(type) {
            return this.getTypesData()[type];
        },
    
        /**
         * @param {String} cognitiveFunction For example: 'Ne', 'Ni', 'Se', 'Te'
         * @param {String} type1 The first type
         * @param {String} type2 The second type
         * @return {Number} The comparative ranking of cognitive functions between two types (0 when the rankings are equal, less than 0 when type1
         * has a lower ranking than type2, greater than 0 when type1 has a higher ranking than type2)
         */
        compareTypesByCognitiveFunctions: function(sortFilter, type1, type2) {
            return this.getSortedRankByCognitiveFunctions(sortFilter, type1) - this.getSortedRankByCognitiveFunctions(sortFilter, type2);
        },
        
        /**
         * @param {Array<String>} sortFilter The cognitive functions to sort MBTI types by where the first cognitive function
         * described in the array has the highest sorting priority; for example: ['Ni', 'Te'] requests the sort rank of the provided
         * MBTI type where the cognitive function 'Ni' is weighted more than 'Te', but in the event of a tie, the MBTI type with a higher
         * rated rank of 'Te' will receive a higher sorted rank
         * @param {String} type The MBTI type to get the sorted rank for
         * @return {Integer} The sorted rank for the provided MBTI type using the provided cognitive functions to sort by. For example:
         * <pre>
         *  // The following boolean expressions evaluate to true
         *  getSortedRankByCognitiveFunctions(['Ni'], 'INTJ') === getSortedRankByCognitiveFunctions(['Ni'], 'INFJ');
         *  getSortedRankByCognitiveFunctions(['Ni', 'Te'], 'INTJ') > getSortedRankByCognitiveFunctions(['Ni', 'Te'], 'INFJ');
         *  getSortedRankByCognitiveFunctions(['Ni', 'Fe'], 'INTJ') < getSortedRankByCognitiveFunctions(['Ni', 'Fe'], 'INFJ');
         * </pre>
         */
        getSortedRankByCognitiveFunctions: function(sortFilter, type) {
            var typeCognitiveFunctions = this.getTypeData(type),
                result = 0;
            
            for (
                var sortPriorityIndex = 0;
                sortPriorityIndex < sortFilter.length;
                sortPriorityIndex++
            ) {
                // NOTE: The weighting of this sort rank depends upon the consistency of the same number of cognitive functions
                // in both the sort filter and each of the MBTI types (each MBTI type always has the same number of cognitive 
                // functions (8) and comparing sort ranks using different sort filters is meaningless).
                var cognitiveFunctionToSortBy = sortFilter[sortPriorityIndex],
                    cognitiveFunctionToSortByWeight = Math.pow(typeCognitiveFunctions.length + 1, sortFilter.length - 1 - sortPriorityIndex);
                
                // Iterate through this type's cognitive functions in order of how strong they are
                for (
                    var typeCognitiveFunctionIndex = 0;
                    typeCognitiveFunctionIndex < typeCognitiveFunctions.length;
                    typeCognitiveFunctionIndex++
                ) {
                    // See note above regarding sort rank weighting
                    var typeCognitiveFunction = typeCognitiveFunctions[typeCognitiveFunctionIndex],
                        typeCognitiveFunctionWeight = typeCognitiveFunctions.length - typeCognitiveFunctionIndex;
                    
                    // If the current cognitive function from the sort filter is found
                    if (typeCognitiveFunction === cognitiveFunctionToSortBy) {
                        // Apply the appropriate weight to the resulting sort rank
                        result += (cognitiveFunctionToSortByWeight * typeCognitiveFunctionWeight);
                        
                        // Discontinue search for this cognitive function once its been found
                        break;
                    }
                }
            }
            
            return result;
        },
        
        /**
         * @param {Array<String>} sortFilter The cognitive functions to sort MBTI types by where the first cognitive function
         * described in the array has the highest sorting priority; for example: ['Ni', 'Te'] sorts MBTI types where the cognitive
         * function 'Ni' is weighted more than 'Te', but in the event of a tie, the MBTI type with a higher rated rank of 'Te' will
         * receive a higher sorted rank
         * @return {Array<String>} List of MBTI types sorted by the provided sort filter
         */
        getSortedTypesByCognitiveFunctions: function(sortFilter) {
            var self = this;
            return Object.keys(this.getTypesData()).sort(function(a, b) {
                return self.getSortedRankByCognitiveFunctions(sortFilter, b) - self.getSortedRankByCognitiveFunctions(sortFilter, a);
            });
        }
    };
    
    var App = {
        /**
         * The current state of the application
         * @var {Object}
         */
        _state: {
            sortedTypes: null,
            typeFilter: '',
            sortBy: null,
        },
        
        /**
         * Associative array holding all important references to dom elements within the component's dom structure
         * @var {Object}
         */
        _dom: {
            container: null,
            typesContainer: null,
            typeFilter: null,
        },
        
        /**
         * Update the current state of the component
         * @param {Function|Object} updater Either:
         * 1) Function called with the previous state of the application; it's returned object's provided properties overwrites the previous application component's state's respective properties
         * 2) Object where its provided properties overwrites the previous application component's state's respective properties
         * @return null
         */
        _setState: function(updater) {
            var prevState = Object.assign({}, this._state),
                newState = Object.assign(
                    {},
                    prevState,
                    typeof updater === 'function'
                        ? updater(prevState)
                        : updater
                );
            
            // Determine whether the state has been updated using a shallow comparison of the previous state and the new one
            var hasUpdated = (function() {
                var result = false;
                
                $.each(this._state, function(index, value) {
                    if (newState[index] !== prevState[index]) {
                        result = true;
                        return false;
                    }
                });
                
                return result;
            });
            
            // If the state was updated, synchronize the interface accordingly
            if (hasUpdated) {
                this._state = newState;
                this.synchronizeInterface();
            }
        },
        
        initialize: function(containerElement) {
            this._dom.container = containerElement;
            
            this.initializeDom();
            this.initializeEventListeners();
            
            this._setState({
                sortedTypes: Object.keys(types),
                typeFilter: '',
                sortBy: [],
            });
        },
        
        /**
         * Initialize the app's dom structure
         */
        initializeDom: function() {
            var container = this._dom.container;
            
            container.html(
                '<div class="Mbti-App">'
                    + '<span class="label">Type:</span><input class="mbti-type-input" type="text" value="" /><br />'
                    + '<span class="label">Order by Cognitive Function:</span><input id="cf" type="text" value="" /><br />'
                    + '<div class="mbti-app-types-container"></div>'
                + '</div>'
            );
            
            Object.assign(this._dom, {
                typesContainer: container.find('.mbti-app-types-container'),
                typeFilter: container.find('.mbti-type-input'),
            });
            
            // Place the hash value from the URL into the MBTI input textbox
            // this._dom.typeFilter.val(window.location.hash.replace('#', ''));
        },
        
        /**
         * @param {String} type The MBTI type
         * @param {String} [typeFilter] The type filter that toggles which MBTI types to show; defaults to this._state.typeFilter if not provided; for example "IJ" or "INFJ,EST"
         * @return {Boolean} Whether the provided MBTI type is toggled to be shown within the user interface via the application's type filter
         */
        isToggled: function(type, typeFilter) {
            if (typeof typeFilter === 'undefined') typeFilter = this._state.typeFilter;
            
            if (typeFilter.indexOf(',') !== -1) {
                // If the type filter is a union of multiple type filters, iterate through each type filter
                var typeFilters = typeFilter.split(',');
                for (var i = 0; i < typeFilters.length; i++) {
                    // If the provided type matches against any of the provided type filters, the provided type is toggled to be shown
                    if (this.isToggled(type, typeFilters[i])) {
                        return true;
                    }
                }
    
                // If none of the provided type filters match the provided type, the type is not toggled to be shown
                return false;
            }
            else {
                // If a letter within the provided type filter does not match the provided type, the type is not toggled to be shown
                for (var i = 0; i < typeFilter.length; i++) {
                    var typeFilterLetter = typeFilter[i];
                    if (type.indexOf(typeFilterLetter) === -1) {
                        return false;
                    }
                }
                
                // Otherwise, the type is toggled to be shown
                return true;
            }
        },
        
        /**
         * Handles when the type filter changes within the user interface and keeps its input limited to valid type filter input only
         */
        handleTypeFilterChange: function() {
            /**
             * @param {String} typeFilter The type filter that toggles which MBTI types to show; for example "IJ", "ES", or "INTJ"
             */
            function processTypeFilter(typeFilter) {
                var newTypeFilter = '';
                
                // Keep track of all letters used in the current type filter's input value
                var letters = ['I', 'E', 'S', 'N', 'F', 'T', 'P', 'J'];
                var lettersUsed = {};
                for (var j = 0; j < letters.length; j++) {
                    var letter = letters[j];
                    lettersUsed[letter] = 0;
                }
                for (var i = 0; i < typeFilter.length; i++) {
                    var typeLetter = typeFilter[i].toUpperCase();
                    if (typeof lettersUsed[typeLetter] != 'undefined') {
                        lettersUsed[typeLetter] += 1;
                    }
                }
                
                // Iterate through each of the MBTI letters and its counter (opposite letter -- such as "N" is opposite to "S", "E" is opposite to "I", etc.)
                for (var i = 0; i < letters.length; i++) {
                    var letter = letters[i],
                        counterLetter = (i % 2 == 0 && typeof letters[i + 1] != 'undefined') ? letters[i + 1] : '';
                    
                    // If this letter has been used and its counter (opposite) letter is not present and this letter has not been added to the new type filter yet
                    if (lettersUsed[letter] && !lettersUsed[counterLetter] && newTypeFilter.indexOf(letter) === -1) {
                        // Add this letter to the resulting new type filter
                        newTypeFilter += letter;
                    }
                }
                
                return newTypeFilter;
            }
            
            // Remember the original input value of the type filter
            var typeFiltersOriginalValue = this._dom.typeFilter.val();
            
            // If the type filter(s) have not changed, then do nothing
            if (typeFiltersOriginalValue === this._state.typeFilter) return;
            
            // Iterate through all type filters in the comma-delimited string
            var typeFilters = typeFiltersOriginalValue.split(','),
                newTypeFilters = [];
            for (var i = 0; i < typeFilters.length; i++) {
                newTypeFilters.push(processTypeFilter(typeFilters[i]));
            }
            
            // Get the new input value of the type filter
            var newTypeFiltersString = newTypeFilters.join(',');
            
            // Update the input with the processed change
            this._dom.typeFilter.val(newTypeFiltersString);
            
            // Update the state with resulting type filter
            this._setState({
                typeFilter: newTypeFiltersString
            });
        },
        
        /**
         * Initialize the app's event listeners
         */
        initializeEventListeners: function() {
            this._dom.typeFilter.on('keyup', () => this.handleTypeFilterChange());
            
            this._dom.container.on('click', '.cognitiveFunction', event => {
                var sortFilter = [$(event.currentTarget).html()];
                this._setState(prevState => ({
                    sortBy: sortFilter,
                    sortedTypes: MbtiTypes.getSortedTypesByCognitiveFunctions(sortFilter),
                }));
            });
            
            // Listen for when the "H" key is pressed to hide the cognitive functions 
            // for the purpose of studying the cognitive functions, using this app as
            // flash cards.
            $(window).keypress(function(event) {
                if (event.which == 104 || event.which == 72) {
                    $('.cognitiveFunction').toggleClass('invisible');
                }
            });
        },
        
        /**
         * @param {Array<String>} types The MBTI types to show
         * @param {String} The HTML of a container that shows all of the provided MBTI types
         */
        getTypesContainerHtml: function(types) {
            var result = '';
            this._state.sortedTypes.forEach(type => {
                if (this.isToggled(type)) {
                    result += this.getTypeContainerHtml(type);
                }
            });
            return result;
        },
        
        /**
         * @param {String} type The MBTI type
         * @return {String} The HTML of a container describing the provided MBTI type
         */
        getTypeContainerHtml: function(type) {
            var cognitiveFunctions = MbtiTypes.getTypeData(type);
            return (
                '<div class="typeContainer typeContainer_' + type + '">'
                    + '<div class="typeLabel">' + type + '</div>'
                    + (function() {
                        var result = '';
                        $.each(cognitiveFunctions, function(index, cognitiveFunction) {
                            result += '<div class="cognitiveFunction tier' + (index + 1) + '">' + cognitiveFunction + '</div>';
                        });
                        return result;
                    })()
                + '</div>'
            );
        },
        
        /**
         * Synchronize the interface with the app's current state
         */
        synchronizeInterface: function() {
            console.log('this._state ==', this._state);
            
            this._dom.typesContainer.html(this.getTypesContainerHtml(this._state.sortedTypes));
            
            // window.location.hash = this._state.typeFilter;
        }
    };
    
    return exports.MbtiFlashcards = App;
})(window);