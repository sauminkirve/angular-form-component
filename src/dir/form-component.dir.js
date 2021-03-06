(function() {
  angular
    .module('mdformComponent', ['formComponent.template', 'ngMaterial'])
    .directive('mdFormComponent', directive);

  directive.$inject = [];

  return directive;

  /**
   * Directive for Sale Form Component
   *
   * @public
   *
   * @memberof   titan.Directives
   *
   * @author     snehilmodani
   *
   */
  function directive() {

    controller.$inject = ['$scope'];

    return {
      restrict: 'EA',
      templateUrl: 'src/tpl/form-component.tpl.html',
      transclude: true,
      // replace: true,
      scope: {
        config: '=',
        model: '=',
        editable: '='
      },
      controller: controller
    };

    // //////////////////////////////////////////////////////

    /**
     * Controller for the App Sidenav
     *
     * @public
     *
     * @method     controller
     *
     * @author     snehilmodani
     *
     * @param      {Object}    $scope    Angular scope
     */
    function controller($scope) {
      var ViewModel = $scope;

      init();

      // //////////////////////////////////////////////////////

      /**
       * Expand Sidebar if true, else collapse
       *
       * @public
       *
       * @author     snehilmodani
       *
       * @param      {Object}  action  Action to perform
       */
      function init() {
        if(ViewModel.config && ViewModel.config.warning) {
          ViewModel.config.warning = false;
        }

        if (ViewModel.config && ViewModel.config.type === 'autocomplete') {
          if(ViewModel.config.autocompleteConfig && ViewModel.config.autocompleteConfig.displayKey && !ViewModel.config.autocompleteConfig.valueKey) {
            ViewModel.config.autocompleteConfig.valueKey = ViewModel.config.autocompleteConfig.displayKey;
          }
          var results = ViewModel.config.autocompleteConfig.querySearch(ViewModel.model[ViewModel.config.code], ViewModel.model).$$state.value || [];
          if(results && results.constructor === Array && results.length === 1) {
            ViewModel.config.autocompleteConfig.selectedItem = results[0];
          } else {
            if(ViewModel.model[ViewModel.config.code] !== undefined && ViewModel.model[ViewModel.config.code] !== null) {
              var found = false;
              for (var idx = results.length - 1; idx >= 0; idx--) {
                var result = results[idx];
                if(ViewModel.config.autocompleteConfig.valueKey) {
                  if(result[ViewModel.config.autocompleteConfig.valueKey] === ViewModel.model[ViewModel.config.code]) {
                    found = true;
                  }
                } else {
                  if(result === ViewModel.model[ViewModel.config.code]) {
                    found = true;
                  }
                }

                if(found) {
                  ViewModel.config.autocompleteConfig.selectedItem = result;
                  break;
                }
              }

              if(!found) {
                ViewModel.config.autocompleteConfig.searchText = ViewModel.model[ViewModel.config.code];
                // delete the selected item if any is selected upon opening of autocomplete
                delete ViewModel.config.autocompleteConfig.selectedItem;
              }
            } else {
              ViewModel.config.autocompleteConfig.searchText = ViewModel.model[ViewModel.config.code];
              // delete the selected item if any is selected upon opening of autocomplete
              delete ViewModel.config.autocompleteConfig.selectedItem;
            }
          }

        } else if (ViewModel.config && ViewModel.config.type === 'date') {
          if(!ViewModel.config.dateConfig) {
            ViewModel.config.dateConfig = {};
          }

          ViewModel.config.dateConfig.minDate = ViewModel.config.dateConfig.minDate ? moment(ViewModel.config.dateConfig.minDate).toDate() : undefined;
          ViewModel.config.dateConfig.maxDate = ViewModel.config.dateConfig.maxDate ? moment(ViewModel.config.dateConfig.maxDate).toDate() : undefined;
          if(typeof ViewModel.model[ViewModel.config.code] === 'number' && ViewModel.model[ViewModel.config.code]) {
            ViewModel.model[ViewModel.config.code] = moment(ViewModel.model[ViewModel.config.code]).toDate();
          }
        } else if (ViewModel.config && ViewModel.config.type === 'checkbox' && ViewModel.model[ViewModel.config.code]) {
          // Hack for string/other truthy values
          ViewModel.model[ViewModel.config.code] = true;
        }else if (ViewModel.config && ViewModel.config.type === 'checkboxWithInput' && ViewModel.model[ViewModel.config.code]) {
          // Hack for string/other truthy values
          ViewModel.model[ViewModel.config.code] = true;
        } else if (ViewModel.config && ViewModel.config.type === 'select') {
          if(!ViewModel.config.selectConfig) {
            ViewModel.config.selectConfig = {};
          }

          if(!ViewModel.config.selectConfig.asyncOptions) {
            ViewModel.config.selectConfig.asyncOptions = function() {
              // body...
            };
          }
        }

        if(ViewModel.model[ViewModel.config.code] !== null && ViewModel.model[ViewModel.config.code] !== undefined) {
          // Call initFn in the beginning
          if(ViewModel.config.initFn && typeof ViewModel.config.initFn === 'function') {
            ViewModel.config.initFn(ViewModel.model[ViewModel.config.code], ViewModel.model);
          }
        }
      }
    }
  }
})();