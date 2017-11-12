import React, { Component } from 'react';
import _ from 'lodash';

// Components
import NumberInput from 'app/components/form/number/NumberInput';
import Button from 'app/components/element/button/Button';

// Util
import { INT_NUMBERS } from 'app/util/keyCode';

// Helper
import calculation, { OPERATORS } from 'app/helper/calculation';

class Calculator extends Component {
    // Life Cycle
    constructor() {
        super();

        this.state = {
            displayNum: 0,
            currentNum: 0,
            operator: OPERATORS.DEFAULT,
            shouldRefresh: false,
        };

        this._handleNumberKeyDown = this._handleNumberKeyDown.bind(this);
        this._handleEqualClick = this._handleEqualClick.bind(this);
        this._handleAddClick = this._handleAddClick.bind(this);
        this._handleSubClick = this._handleSubClick.bind(this);
        this._handleResetClick = this._handleResetClick.bind(this);
    }

    componentWillMount() {
        document.addEventListener('keydown', this._handleNumberKeyDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this._handleNumberKeyDown, false);
    }

    // Event Handlers
    _handleNumberKeyDown(e) {
        let { displayNum, shouldRefresh } = this.state,
            value = _getResultValue(e.which, displayNum, shouldRefresh);

        this.setState({
            displayNum: value,
            shouldRefresh: false,
        });
    }

    _handleEqualClick() {
        let { displayNum, currentNum, operator } = this.state,
            newNum = calculation.calc(currentNum, displayNum, operator);

        this.setState({
            displayNum: newNum,
            currentNum: newNum,
            operator: OPERATORS.DEFAULT,
            shouldRefresh: false,
        })
    }

    _handleAddClick() {
        let { displayNum, currentNum, operator } = this.state,
            newNum = calculation.calc(currentNum, displayNum, operator);

        this.setState({
            displayNum: newNum,
            currentNum: newNum,
            operator: OPERATORS.PLUS,
            shouldRefresh: true,
        });
    }

    _handleSubClick() {
        let { displayNum, currentNum, operator } = this.state;

        if (currentNum === 0) {
            this.setState({
                currentNum: displayNum,
                operator: OPERATORS.MINUS,
                shouldRefresh: true,
            });

            return;
        }

        let newNum = calculation.calc(currentNum, displayNum, operator);

        this.setState({
            displayNum: newNum,
            currentNum: newNum,
            operator: OPERATORS.MINUS,
            shouldRefresh: true,
        });
    }

    _handleBtnClick(numString) {
        let { displayNum, shouldRefresh } = this.state,
            value;

        if (shouldRefresh) {
            value = _.toNumber(numString);
        } else {
            let oriNumString = _.toString(displayNum),
                resultString = oriNumString + numString;

            value = _.toNumber(resultString);
        }

        this.setState({
            displayNum: value,
            shouldRefresh: false,
        });
    }

    _handleResetClick() {
        this.setState({
            displayNum: 0,
            currentNum: 0,
            operator: OPERATORS.DEFAULT,
            shouldRefresh: false,
        });
    }

    // Render
    render() {
        return (
            <div>
                <div>
                    <NumberInput value={this.state.displayNum} />
                </div>
                <div>
                    <Button onClick={this._handleBtnClick.bind(this, '1')}>1</Button>
                    <Button onClick={this._handleBtnClick.bind(this, '2')}>2</Button>
                    <Button onClick={this._handleBtnClick.bind(this, '3')}>3</Button>
                    <Button onClick={this._handleBtnClick.bind(this, '4')}>4</Button>
                    <Button onClick={this._handleBtnClick.bind(this, '5')}>5</Button>
                    <Button onClick={this._handleBtnClick.bind(this, '6')}>6</Button>
                    <Button onClick={this._handleBtnClick.bind(this, '7')}>7</Button>
                    <Button onClick={this._handleBtnClick.bind(this, '8')}>8</Button>
                    <Button onClick={this._handleBtnClick.bind(this, '9')}>9</Button>
                    <Button onClick={this._handleBtnClick.bind(this, '0')}>0</Button>
                    <Button onClick={this._handleEqualClick} >=</Button>
                    <Button onClick={this._handleAddClick}>+</Button>
                    <Button onClick={this._handleSubClick}>-</Button>
                    <Button onClick={this._handleResetClick}>RESET</Button>
                </div>
            </div>
        );
    }
}

function _getResultValue(keyCode, num, shouldRefresh) {
    let oriNumString = _.toString(num),
        result;

    if (shouldRefresh) {
        return _.toNumber(String.fromCharCode(keyCode));
    }

    if (keyCode === 8) {
        let resultString = oriNumString === '0' ? oriNumString : oriNumString.slice(0, -1);
        result = _.toNumber(resultString);
    } else if (INT_NUMBERS.indexOf(keyCode) > -1) {
        let appendString = String.fromCharCode(keyCode);
        let resultString = oriNumString === '0' ? appendString : oriNumString + appendString;
        result = _.toNumber(resultString);
    } else {
        result = _.toNumber(oriNumString);
    }

    return result;
}

export default Calculator;
