import React, { ReactElement, ReactNode, useState } from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors, sizes } from '../UI';

export type ValueType = {
    label: string;
    value: string | null;
};

type Props = {
    options: any;
    open: boolean;
    value: ValueType | null;
    setOpen: (b: boolean) => void;
    setValue: (v: ValueType | null) => void;
    placeholder: ReactNode;
    containerStyle?: ViewStyle;
};

export const DropDown = ({
    options,
    open,
    value,
    setOpen,
    setValue,
    placeholder,
    containerStyle
}: Props): ReactElement => {
    const [labelHeight, setLabelHeight] = useState(0);
    return (
        <View
            style={[
                styles.container,
                {
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    borderBottomRightRadius: open ? 0 : 10,
                    borderBottomLeftRadius: open ? 0 : 10
                },
                containerStyle
            ]}
        >
            <View
                style={styles.labelContainer}
                onLayout={(e) => setLabelHeight(e.nativeEvent.layout.height)}
            >
                <TouchableOpacity
                    style={styles.label}
                    onPress={() => setOpen(!open)}
                >
                    <Text style={styles.labelText}>
                        {value?.value ? (
                            <Text>{value.label}</Text>
                        ) : (
                            placeholder
                        )}
                    </Text>
                </TouchableOpacity>
            </View>
            {open && (
                <View
                    style={[
                        styles.list,
                        { transform: [{ translateY: labelHeight }] }
                    ]}
                >
                    {options.map((item: ValueType) => (
                        <TouchableOpacity
                            style={styles.optionContainer}
                            key={item.value}
                            onPress={() => {
                                setValue(item);
                                setOpen(false);
                            }}
                        >
                            <Text style={styles.optionText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.altWhite,
        borderRadius: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5
    },
    labelContainer: {},
    label: {
        paddingHorizontal: '8%',
        paddingVertical: 4
    },
    labelText: {
        fontSize: 16,
        textAlign: 'center'
    },
    list: {
        position: 'absolute',
        backgroundColor: colors.altWhite,
        width: '100%',
        paddingVertical: 2,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopColor: colors.gray,
        borderTopWidth: 1,
        maxHeight: sizes.windowH * 0.25
    },
    optionContainer: {
        paddingHorizontal: '8%',
        paddingVertical: '6%'
    },
    optionText: {
        fontSize: 16
    }
});
