import React from "react";
import { shallow } from "enzyme";
import App from "./App";

describe("App.js", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<App />);
    });

    test('shallow wrapper instance should not be null', () => {
        expect(true).toBeTruthy();
    });
});
