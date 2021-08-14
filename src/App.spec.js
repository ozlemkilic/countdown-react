import React from "react";
import { shallow } from "enzyme";
import App from "./App";

describe("App.js", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<App />);
    });

    it('should render', () => {
        expect(wrapper).not.toBeNull();
    });

    describe('DOM', () => {
        it('should have a description area', () => {
            expect(wrapper.find('.description').length).toEqual(1);
        });

        it('should have not a description area', async () => {
            wrapper.setState({ isCompleted: true });

            expect(wrapper.find('.description').exists()).toBeFalsy();
        });

        it('should have `a` tag', () => {
            expect(wrapper.find('a').length).toEqual(1);
        });

        it('should have not `a` tag', async () => {
            wrapper.setState({ isCompleted: true });

            expect(wrapper.find('a').exists()).toBeFalsy();
        });

        it('should have correct url', async () => {
            const url = 'www.googgle.com';
            wrapper.setState({ data: { url } });

            expect(wrapper.find('a').props().href).toEqual(url);
        });

        it('should have correct offer text', async () => {
            wrapper.setState({ data: { cash_value: 10 } });

            expect(wrapper.find('.description p').text()).toContain('10');
        });

        it('should have correct duration', async () => {
            wrapper.setState({ time: { hours: 1, minutes: 35, seconds: 20 } });

            expect(wrapper.find('.hours p').at(0).text()).toEqual('01');
            expect(wrapper.find('.minutes p').at(0).text()).toEqual('35');
            expect(wrapper.find('.seconds p').at(0).text()).toEqual('20');
        });
    });
});
