import React from "react";
import { shallow } from "enzyme";
import Countdown from "../components/Countdown";

describe("Countdown.js", () => {
    let wrapper;
    const changeState = jest.fn();

    beforeEach(() => {
        wrapper = shallow(<Countdown durationHour={10} changeState={changeState}/>);
    });

    it('should render', () => {
        expect(wrapper).not.toBeNull();
    });

    it('should have correct duration', async () => {
        await wrapper.setProps({ durationHour: 0 });

        expect(wrapper.find('.hours p').at(0).text()).toEqual('00');
        expect(wrapper.find('.minutes p').at(0).text()).toEqual('00');
        expect(wrapper.find('.seconds p').at(0).text()).toEqual('00');
    });
});
