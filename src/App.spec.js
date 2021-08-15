import React from "react";
import { shallow } from "enzyme";
import App from "./App";

describe("App.js", () => {
    const defaultData = {
        "url": "https://www.jackpotjoy.com",
        "duration_hour": 10,
        "cash_value": 10
    };
    const unMockedFetch = global.fetch;
    const mockedFetch = () =>
        Promise.resolve({
            json: () => Promise.resolve(defaultData)
        });
    let wrapper;

    beforeAll(() => {
        global.fetch = mockedFetch;
    });

    afterAll(() => {
        global.fetch = unMockedFetch;
    });

    beforeEach(() => {
        wrapper = shallow(<App />);
    });

    afterEach(() => {
        wrapper.unmount();
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

    describe('Life cycles', () => {
        it('should call readFile method when component did mount', () => {
            const instance = wrapper.instance();

            jest.spyOn(instance, 'readFile');
            instance.componentDidMount();

            expect(instance.readFile).toHaveBeenCalledTimes(1);
        });

        it('should clear interval when component did unmount', () => {
            jest.useFakeTimers();
            wrapper.instance().componentWillUnmount();

            expect(clearInterval).toHaveBeenCalledWith(expect.any(Number));
        });
    });

    describe('Functions', () => {
        it('should change data state when readFile function did call', async () => {
            const instance = wrapper.instance();

            await instance.readFile();

            expect(instance.state.data).toMatchObject(defaultData);
        });

        it('should reject readFile method when component did mount', async () => {
            global.fetch = unMockedFetch;
            global.fetch = () =>
                Promise.resolve({
                    json: () => Promise.resolve(undefined)
                });
            const rejectedWrapper = await shallow(<App />);
            const instance = rejectedWrapper.instance();

            await instance.readFile();

            expect(instance.state.data).toBe(undefined);

            global.fetch = mockedFetch;
        });

        it('should change time state correctly when startTimer function did call', () => {
            const instance = wrapper.instance();

            wrapper.setState({ time: { hours: 0, minutes: 0, seconds: 0 } });
            instance.startTimer();

            expect(instance.state.isCompleted).toBeTruthy();

            wrapper.setState({ time: { hours: 10, minutes: 0, seconds: 0 } });
            instance.startTimer();

            expect(instance.state.time.hours).toBe(9);

            wrapper.setState({ time: { hours: 9, minutes: 58, seconds: 0 } });
            instance.startTimer();

            expect(instance.state.time.minutes).toBe(57);

            wrapper.setState({ time: { hours: 9, minutes: 58, seconds: 45 } });
            instance.startTimer();

            expect(instance.state.time.seconds).toBe(44);
        });

        it('should add zero to numbers when addPad function did call', () => {
            let hours = '6';
            hours = wrapper.instance().addPad(hours);

            expect(hours).toEqual('06');
        });
    });
});
