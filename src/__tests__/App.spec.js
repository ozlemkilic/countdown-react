import React from "react";
import { shallow } from "enzyme";
import App from "../App";
import Countdown from "../components/Countdown";

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

    it('should render child component', () => {
        expect(wrapper.find(Countdown).exists()).toBeTruthy();
    });

    describe('DOM', () => {
        it('should have a description area', () => {
            expect(wrapper.find('.description').length).toEqual(1);
        });

        it('should have not a description area if countdown is completed', async () => {
            wrapper.setState({ isCompleted: true });

            expect(wrapper.find('.description').exists()).toBeFalsy();
        });

        it('should have `a` tag', () => {
            expect(wrapper.find('a').length).toEqual(1);
        });

        it('should have not `a` tag if countdown is completed', async () => {
            wrapper.setState({ isCompleted: true });

            expect(wrapper.find('a').exists()).toBeFalsy();
        });

        it('should have `a` tag with correct url', async () => {
            const url = 'www.googgle.com';

            wrapper.setState({ data: { url } });

            expect(wrapper.find('a').props().href).toEqual(url);
        });

        it('should have correct offer text with cache value', async () => {
            wrapper.setState({ data: { cash_value: 10 } });

            expect(wrapper.find('.description p').text()).toContain('10');
        });
    });

    describe('Life cycles', () => {
        it('should call readFile function when component did mount', () => {
            const instance = wrapper.instance();

            jest.spyOn(instance, 'readFile');
            instance.componentDidMount();

            expect(instance.readFile).toHaveBeenCalledTimes(1);
        });
    });

    describe('Functions', () => {
        it('should change data state when readFile function did call', async () => {
            const instance = wrapper.instance();

            await instance.readFile();

            expect(instance.state.data).toMatchObject(defaultData);
        });

        it('should have undefined data if fetch method did not have response', async () => {
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
    });
});
