var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Component = (function () {
    function Component(element, name) {
        this.element = element;
        this.name = name;
    }
    Component.prototype.greet = function () {
        return "Hello, " + this.element;
    };
    return Component;
}());
var SelectOption = (function () {
    function SelectOption(value, text) {
        this.value = value;
        this.text = text;
    }
    return SelectOption;
}());
var SelectOne = (function (_super) {
    __extends(SelectOne, _super);
    function SelectOne(element, options) {
        return _super.call(this, { element: element }) || this;
    }
    SelectOne.prototype.setValue = function (value) {
        this.value = value;
    };
    SelectOne.prototype.getValue = function () {
        return this.value;
    };
    return SelectOne;
}(Component));
var node = document.createElement('div');
var s = new SelectOne({ element: node });
s.setValue(5);
//# sourceMappingURL=Component.js.map