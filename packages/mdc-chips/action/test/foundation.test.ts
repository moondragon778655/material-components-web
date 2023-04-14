/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {MDCChipActionAttributes, MDCChipActionEvents, MDCChipActionFocusBehavior, MDCChipActionInteractionTrigger, MDCChipActionType} from '../constants';
import {MDCChipActionFoundation} from '../foundation';

class SelectableMDCChipActionFoundation extends MDCChipActionFoundation {
  actionType() {
    return MDCChipActionType.UNSPECIFIED;
  }

  isSelectable() {
    return true;
  }

  shouldEmitInteractionOnRemoveKey() {
    return false;
  }
}

class NonselectableMDCChipActionFoundation extends MDCChipActionFoundation {
  actionType() {
    return MDCChipActionType.UNSPECIFIED;
  }

  isSelectable() {
    return false;
  }

  shouldEmitInteractionOnRemoveKey() {
    return false;
  }
}

class SelectableDeletableMDCChipActionFoundation extends
    MDCChipActionFoundation {
  actionType() {
    return MDCChipActionType.UNSPECIFIED;
  }

  isSelectable() {
    return true;
  }

  shouldEmitInteractionOnRemoveKey() {
    return true;
  }
}

describe('MDCChipActionFoundation', () => {
  describe('[shared behavior]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(SelectableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    it(`#actionType returns "${MDCChipActionType.UNSPECIFIED}"`, () => {
      const {foundation} = setupTest();
      expect(foundation.actionType()).toBe(MDCChipActionType.UNSPECIFIED);
    });

    it('#setFocus() does nothing when aria-hidden == true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ARIA_HIDDEN)
          .and.returnValue('true');
      foundation.setFocus(MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
      foundation.setFocus(MDCChipActionFocusBehavior.FOCUSABLE);
      foundation.setFocus(MDCChipActionFocusBehavior.NOT_FOCUSABLE);
      expect(mockAdapter.setAttribute).not.toHaveBeenCalled();
      expect(mockAdapter.focus).not.toHaveBeenCalled();
    });

    it(`#setFocus(${
           MDCChipActionFocusBehavior
               .FOCUSABLE_AND_FOCUSED}) sets tabindex="0"` +
           ` and focuses the root`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setFocus(MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
         // TODO: Wait until b/208710526 is fixed, then remove this
         // autogenerated error suppression.
         //  @ts-ignore(go/unfork-jasmine-typings): Argument of type
         //  '"tabindex"' is not assignable to parameter of type
         //  'Expected<MDCChipActionAttributes>'.
         expect(mockAdapter.setAttribute).toHaveBeenCalledWith('tabindex', '0');
         expect(mockAdapter.focus).toHaveBeenCalled();
       });

    it(`#setFocus(${MDCChipActionFocusBehavior.FOCUSABLE}) sets tabindex="0"`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setFocus(MDCChipActionFocusBehavior.FOCUSABLE);
         // TODO: Wait until b/208710526 is fixed, then remove this
         // autogenerated error suppression.
         //  @ts-ignore(go/unfork-jasmine-typings): Argument of type
         //  '"tabindex"' is not assignable to parameter of type
         //  'Expected<MDCChipActionAttributes>'.
         expect(mockAdapter.setAttribute).toHaveBeenCalledWith('tabindex', '0');
         expect(mockAdapter.focus).not.toHaveBeenCalled();
       });

    it(`#setFocused(${
           MDCChipActionFocusBehavior.NOT_FOCUSABLE}) sets tabindex="-1"`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setFocus(MDCChipActionFocusBehavior.NOT_FOCUSABLE);
         expect(mockAdapter.setAttribute)
             // TODO: Wait until b/208710526 is fixed, then remove this
             // autogenerated error suppression.
             //  @ts-ignore(go/unfork-jasmine-typings): Argument of type
             //  '"tabindex"' is not assignable to parameter of type
             //  'Expected<MDCChipActionAttributes>'.
             .toHaveBeenCalledWith('tabindex', '-1');
       });

    it('#isFocusable returns true if aria-hidden != true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ARIA_HIDDEN)
          .and.returnValue(null);
      expect(foundation.isFocusable()).toBe(true);
    });

    it('#isFocusable returns false if aria-hidden == true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ARIA_HIDDEN)
          .and.returnValue('true');
      expect(foundation.isFocusable()).toBe(false);
    });

    it('#isFocusable returns true if aria-disabled != true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ARIA_DISABLED)
          .and.returnValue('false');
      expect(foundation.isFocusable()).toBe(true);
    });

    it('#isFocusable returns false if aria-disabled == true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ARIA_DISABLED)
          .and.returnValue('true');
      expect(foundation.isFocusable()).toBe(false);
    });

    it('#isSelected returns true if aria-checked == true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ARIA_SELECTED)
          .and.returnValue('true');
      expect(foundation.isSelected()).toBe(true);
    });

    it(`#isSelected returns false if ${
           MDCChipActionAttributes.ARIA_SELECTED} != true`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttribute
             .withArgs(MDCChipActionAttributes.ARIA_SELECTED)
             .and.returnValue('false');
         expect(foundation.isSelected()).toBe(false);
       });

    it(`#handleClick does not emit ${
           MDCChipActionEvents.INTERACTION} when disabled`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttribute
             .withArgs(MDCChipActionAttributes.ARIA_DISABLED)
             .and.returnValue('true');
         foundation.handleClick();
         expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
       });

    it(`#handleClick emits ${MDCChipActionEvents.INTERACTION} with detail`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getElementID.and.returnValue('foo');
         foundation.handleClick();
         expect(mockAdapter.emitEvent)
             .toHaveBeenCalledWith(MDCChipActionEvents.INTERACTION, {
               actionID: 'foo',
               source: MDCChipActionType.UNSPECIFIED,
               trigger: MDCChipActionInteractionTrigger.CLICK,
             });
       });
  });

  describe('[non-deletable]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(SelectableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    const emittingKeys = [
      {key: 'Enter', trigger: MDCChipActionInteractionTrigger.ENTER_KEY},
      {key: 'Spacebar', trigger: MDCChipActionInteractionTrigger.SPACEBAR_KEY},
    ];

    for (const {key, trigger} of emittingKeys) {
      it(`#handleKeydown(${key}) emits ${
             MDCChipActionEvents.INTERACTION} with detail`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           const evt = {
             preventDefault: jasmine.createSpy('preventDefault') as Function,
             key,
           } as KeyboardEvent;
           foundation.handleKeydown(evt);
           expect(mockAdapter.emitEvent)
               .toHaveBeenCalledWith(MDCChipActionEvents.INTERACTION, {
                 actionID: '',
                 source: MDCChipActionType.UNSPECIFIED,
                 trigger,
               });
           expect(evt.preventDefault).toHaveBeenCalled();
         });
    }

    const nonemittingKeys = [
      'Delete',
      'Backspace',
    ];

    for (const key of nonemittingKeys) {
      it(`#handleKeydown(${key}) does not emit ${
             MDCChipActionEvents.INTERACTION}`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           foundation.handleKeydown({key} as KeyboardEvent);
           expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
         });
    }
  });

  describe('[deletable]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(SelectableDeletableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    const emittingKeys = [
      {key: 'Enter', trigger: MDCChipActionInteractionTrigger.ENTER_KEY},
      {key: 'Spacebar', trigger: MDCChipActionInteractionTrigger.SPACEBAR_KEY},
      {
        key: 'Backspace',
        trigger: MDCChipActionInteractionTrigger.BACKSPACE_KEY
      },
      {key: 'Delete', trigger: MDCChipActionInteractionTrigger.DELETE_KEY},
    ];

    for (const {key, trigger} of emittingKeys) {
      it(`#handleKeydown(${key}) emits ${
             MDCChipActionEvents.INTERACTION} with detail`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           const evt = {
             preventDefault: jasmine.createSpy('preventDefault') as Function,
             key,
           } as KeyboardEvent;
           foundation.handleKeydown(evt);
           expect(mockAdapter.emitEvent)
               .toHaveBeenCalledWith(MDCChipActionEvents.INTERACTION, {
                 actionID: '',
                 source: MDCChipActionType.UNSPECIFIED,
                 trigger,
               });
           expect(evt.preventDefault).toHaveBeenCalled();
         });
    }
  });

  describe('[selectable]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(SelectableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    it(`#setSelected(true) sets ${
           MDCChipActionAttributes.ARIA_SELECTED} to true`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setSelected(true);
         expect(mockAdapter.setAttribute)
             .toHaveBeenCalledWith(
                 MDCChipActionAttributes.ARIA_SELECTED, 'true');
       });

    it(`#setSelected(false) sets ${
           MDCChipActionAttributes.ARIA_SELECTED} to false`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setSelected(false);
         expect(mockAdapter.setAttribute)
             .toHaveBeenCalledWith(
                 MDCChipActionAttributes.ARIA_SELECTED, 'false');
       });

    it(`#setDisabled(true) sets ${
           MDCChipActionAttributes.ARIA_DISABLED} to true`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setDisabled(true);
         expect(mockAdapter.setAttribute)
             .toHaveBeenCalledWith(
                 MDCChipActionAttributes.ARIA_DISABLED, 'true');
       });

    it(`#setDisabled(false) sets aria-hidden="false"`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setDisabled(false);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith(MDCChipActionAttributes.ARIA_DISABLED, 'false');
    });

    it(`#setDisabled(true) sets aria-hidden="true"`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setDisabled(true);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith(MDCChipActionAttributes.ARIA_DISABLED, 'true');
    });

    it(`#isDisabled() return true when aria-hidden="true"`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ARIA_DISABLED)
          .and.returnValue('true');
      expect(foundation.isDisabled()).toBeTrue();
    });

    it(`#isDisabled() return false when aria-hidden="false"`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ARIA_DISABLED)
          .and.returnValue('false');
      expect(foundation.isDisabled()).toBeFalse();
    });
  });

  describe('[non-selectable]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(NonselectableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    it(`#setSelected(true|false) does not set ${
           MDCChipActionAttributes.ARIA_SELECTED}`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setSelected(true);
         foundation.setSelected(false);
         expect(mockAdapter.setAttribute).not.toHaveBeenCalled();
       });

    it(`#setDisabled(false) remove the disabled attribute`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setDisabled(false);
      expect(mockAdapter.removeAttribute)
          .toHaveBeenCalledWith(MDCChipActionAttributes.DISABLED);
    });

    it(`#setDisabled(true) sets disabled="true"`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setDisabled(true);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith(MDCChipActionAttributes.DISABLED, 'true');
    });

    it(`#isDisabled() return true when the disabled attribute exists`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.DISABLED)
          .and.returnValue('');
      expect(foundation.isDisabled()).toBeTrue();
    });

    it(`#isDisabled() return false when the disabled attribute is absent`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.DISABLED)
             .and.returnValue(null);
         expect(foundation.isDisabled()).toBeFalse();
       });
  });
});
