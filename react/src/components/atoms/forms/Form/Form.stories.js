import React from 'react';
import { storiesOf } from '@storybook/react';
import { object, withKnobs, text, number, array } from '@storybook/addon-knobs';
import is from 'is';
import numbro from 'numbro';
import deepEqual from 'fast-deep-equal';

import Form, { FormProvider } from './index';
import FormDocs from './Form.md';
import InputNumber from '../InputNumber';
import InputNumberOptions from '../InputNumber/InputNumber.knobs.options';
import InputSliderOptions from '../InputSlider/InputSlider.knobs.options';
import InputSlider from '../InputSlider';
import InputCurrency from '../InputCurrency';
import InputCurrencyOptions from '../InputCurrency/InputCurrency.knobs.options';
import InputSync from '../InputSync';
import Paragraph from '../../../atoms/text/Paragraph';
import { countDecimals } from '../Input/utility';
import './story.css';

storiesOf('atoms/forms', module)
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add(
    'Form', (() => {
      delete InputNumberOptions.defaultValue;

      const inputTextOptionsWithKnobs = Object.assign(...Object.entries(InputNumberOptions).map(([k, v]) => (
        { [k]: v() })));


      delete InputSliderOptions.ticks;
      delete InputSliderOptions.labelText;
      delete InputSliderOptions.step;
      delete InputSliderOptions.max;
      delete InputSliderOptions.domain;

      const inputSliderOptionsWithKnobs = Object.assign(...Object.entries(InputSliderOptions).map(([k, v]) => (
        { [k]: v() })));
      inputSliderOptionsWithKnobs.domain = array('InputSlider.domain', [0, 1]).map((num) => Number(num));
      inputSliderOptionsWithKnobs.max = number('InputSlider.max', 1);
      inputSliderOptionsWithKnobs.step = number('InputSlider.step', 0.01, { min: 0, max: 1, step: 0.01 });
      inputSliderOptionsWithKnobs.labelText = text('InputSlider.labelText', 'Slider (Linked to Input 0 and Input 1)');
      const formTicks = object('InputSlider.ticks', { 0: '0%', 0.6: 'Minimum requirement', 1: '100%' });
      const ticks = [];
      Object.keys(formTicks).forEach((tick) => ticks.push([tick, formTicks[tick]]));
      inputSliderOptionsWithKnobs.ticks = ticks;
      // Make sure the domain is within the same range as the min and max of the input to make this work.
      delete InputCurrencyOptions.labelText;
      const inputCurrencyOptionsWithKnobs = Object.assign(...Object.entries(InputCurrencyOptions).map(([k, v]) => (
        { [k]: v() })));
      inputCurrencyOptionsWithKnobs.labelText = text('InputCurrency.labelText', 'Currency Input (Set to 999 when Slider is greater than 60)');
      const languages = new Map();
      languages.set('Chinese', 'zh-CN');
      languages.set('English', 'en-US');
      languages.set('French', 'fr-FR');
      languages.set('Russian', 'ru-RU');
      inputCurrencyOptionsWithKnobs.language = languages.get(inputCurrencyOptionsWithKnobs.language);
      return(
        <FormProvider>
          <Form>
            {
            (formContext) => {
              inputTextOptionsWithKnobs.overrideLinkedValue = (sourceInputId, val) => {
                if (sourceInputId === 'slider') {
                  return Number(numbro(val * 100).format({ mantissa: countDecimals(inputTextOptionsWithKnobs.step) }));
                }
                return val;
              };
              const ids = [
                [
                  'test0',
                  {
                    ...inputTextOptionsWithKnobs,
                    key: 'Form.InputNumber.test0',
                    defaultValue: 0,
                    labelText: 'Input 0 (Linked to Input 1, Input 2, and Slider)',
                    id: 'test0',
                    unit: '%',
                    linkedInputProviders: ['test1', 'test2', 'slider']
                  }
                ],
                [
                  'test1',
                  {
                    ...inputTextOptionsWithKnobs,
                    key: 'Form.InputNumber.test1',
                    labelText: 'Input 1 (Linked to Input 0, Input 2, and Slider)',
                    id: 'test1',
                    unit: '%'
                  }
                ],
                [
                  'test2',
                  {
                    ...inputTextOptionsWithKnobs,
                    key: 'Form.InputNumber.test2',
                    labelText: 'Input 2 (Linked to Input 0, Input 1, and Slider)',
                    id: 'test2',
                    unit: '%'
                  }
                ]
              ];
              const inputs = [];
              ids.forEach((numberProps) => {
                inputs.push(<InputNumber {...numberProps[1]} />);
              });
              // Custom conditions for when InputSync updates.
              // InputSync will normally update whenever the form ids in formIds update.
              // InputSync can only watch form ids that actually exist,
              // so it must come after the input it is watching has been rendered.
              const inputSyncProps = {
                inputProviderIds: ['currency-input', 'test0', 'test1', 'test2']
              };
              // We still want the slider to change the other Inputs, so add an override function.
              // Update the inputs back to percentages when slider changes value.
              inputSliderOptionsWithKnobs.overrideLinkedValue = (sourceInputId, val) => {
                return Number(numbro(val / 100).format({ mantissa: countDecimals(inputSliderOptionsWithKnobs.step) }));
              };
              // Slider doesn't have an input element, so we should use state.value with it. This is set to true by default for sliders.
              inputSliderOptionsWithKnobs.useOwnStateValue = true;
              return(
                <React.Fragment>
                  <div className="align-left">
                    <InputCurrency {...inputCurrencyOptionsWithKnobs} />
                    {inputs}
                    <InputSlider {...inputSliderOptionsWithKnobs} id="slider" />
                  </div>
                  <div className="full-right">
                    <InputSync {...inputSyncProps}>
                      {() => (
                        <React.Fragment>
                          <span>Updates when Currency Input is greater than $5.00.</span>
                          <Paragraph text={`Input 0: ${formContext.getInputProviderValue('test0')}`} />
                          <Paragraph text={`Input 1: ${formContext.getInputProviderValue('test1')}`} />
                          <Paragraph text={`Input 2: ${formContext.getInputProviderValue('test2')}`} />
                          <Paragraph text={`Currency Input: ${formContext.getInputProviderValue('currency-input')}`} />
                          <Paragraph text={`Slider: ${formContext.getInputProviderValue('slider')}`} />
                        </React.Fragment>
                      ) }
                    </InputSync>
                  </div>
                </React.Fragment>
              );
            }
          }
          </Form>
        </FormProvider>
      );
    }),
    { info: FormDocs }
  );
