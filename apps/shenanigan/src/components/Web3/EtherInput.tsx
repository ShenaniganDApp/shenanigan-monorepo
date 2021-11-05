import React, { useState } from 'react';
import {
    NativeSyntheticEvent,
    TextInput,
    TextInputChangeEventData
} from 'react-native';

type Props = {
    price: number;
    value?: number | string;
    placeholder?: string;
    autoFocus?: boolean;
    onChange?: (newValue: string | number) => void;
};

export default function EtherInput(props: Props) {
    const [mode, setMode] = useState(props.price ? 'USD' : 'ETH');
    const [display, setDisplay] = useState<string | number>();
    const [value, setValue] = useState<string | number>();

    const currentValue =
        typeof props.value !== 'undefined' ? props.value : value;

    const option = (title: string) => {
        if (!props.price) return '';
        return (
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    if (mode === 'USD') {
                        setMode('ETH');
                        setDisplay(currentValue);
                    } else {
                        setMode('USD');
                        if (currentValue) {
                            const usdValue = `${(
                                parseFloat(currentValue as string) * props.price
                            ).toFixed(2)}`;
                            setDisplay(usdValue);
                        } else {
                            setDisplay(currentValue);
                        }
                    }
                }}
            >
                {title}
            </div>
        );
    };

    let prefix;
    let addonAfter;
    if (mode === 'USD') {
        prefix = '$';
        addonAfter = option('USD 🔀');
    } else {
        prefix = 'Ξ';
        addonAfter = option('ETH 🔀');
    }

    return (
        <TextInput
            placeholder={props.placeholder ? props.placeholder : 'amount'}
            autoFocus={props.autoFocus}
            // prefix={prefix}
            value={display as string}
            // addonAfter={addonAfter}
            onChange={async (
                e: NativeSyntheticEvent<TextInputChangeEventData>
            ) => {
                const newValue = e.nativeEvent.text;
                if (mode === 'USD') {
                    const ethValue = parseFloat(newValue) / props.price;
                    setValue(ethValue);
                    if (typeof props.onChange === 'function') {
                        props.onChange(ethValue);
                    }
                    setDisplay(newValue);
                } else {
                    setValue(newValue);
                    if (typeof props.onChange === 'function') {
                        props.onChange(newValue);
                    }
                    setDisplay(newValue);
                }
            }}
        />
    );
}
