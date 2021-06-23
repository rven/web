odoo.define("web_advanced_search.CustomFilterItem", function (require) {
    "use strict";

    const CustomFilterItem = require("web.CustomFilterItem");
    const FieldMany2One = require("web.relational_fields").FieldMany2One;
    const Relational = require("web_advanced_search.RelationalOwl");
    const {FIELD_TYPES} = require("web.searchUtils");

    CustomFilterItem.patch("web_advanced_search.CustomFilterItem", (T) => {
        class AdvancedCustomFilterItem extends T {
            constructor() {
                super(...arguments);
                this.OPERATORS.relational = _.sortBy(this.OPERATORS.char, (op) => {
                    switch (true) {
                        case op.symbol === "=" && op.value === undefined:
                            return -2;
                        case op.symbol === "!=" && op.value === undefined:
                            return -1;
                        default:
                            return 0;
                    }
                });
                this.FIELD_TYPES.many2one = "relational";
                // This.FIELD_TYPES.one2many = Relational;
                // this.FIELD_TYPES.many2many = Relational;
            }

            /**
             * @private
             * @param {Object} condition
             */
            _setDefaultValue(condition) {
                const fieldType = this.fields[condition.field].type;
                const genericType = FIELD_TYPES[fieldType];
                if (genericType === "relational") {
                    condition.displayedValue = "";
                } else {
                    super._setDefaultValue(...arguments);
                }
            }
        }

        return AdvancedCustomFilterItem;
    });
    // Extends HomeMenuWrapper components
    CustomFilterItem.components = Object.assign({}, CustomFilterItem.components, {
        FieldMany2One,
        Relational,
    });
});
