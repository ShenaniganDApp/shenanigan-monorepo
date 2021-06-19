import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SwiperContext } from '../../contexts';
import { DropDown, ValueType } from './DropDown';

type Props = {};

export const Filters = (props: Props): ReactElement => {
    const [openSort, setOpenSort] = useState(false);
    const [sortValue, setSortValue] = useState<ValueType | null>(null);
    const [sortOptions, setSortOptions] = useState([
        { label: 'Sort by: Price ↑', value: 'sort1' },
        { label: 'Sort by: Price ↓', value: 'sort2' }
    ]);

    const [openFilter, setOpenFilter] = useState(false);
    const [filterValue, setFilterValue] = useState<ValueType | null>(null);
    const [filterOptions, setFilterOptions] = useState([
        { label: 'None', value: null },
        { label: 'Filter 1', value: 'filter1' },
        { label: 'Filter 2', value: 'filter2' }
    ]);

    const { setWalletScroll } = useContext(SwiperContext);

    useEffect(() => {
        if (openSort || openFilter) {
            setWalletScroll(false);
        } else {
            setWalletScroll(true);
        }
    }, [openSort, openFilter]);

    return (
        <View style={styles.container}>
            <DropDown
                open={openSort}
                value={sortValue}
                options={sortOptions}
                setOpen={setOpenSort}
                setValue={setSortValue}
                placeholder={<Text>Sort by: Price ↑</Text>}
                containerStyle={styles.dropDownContainer}
            />
            <DropDown
                open={openFilter}
                value={filterValue}
                options={filterOptions}
                setOpen={setOpenFilter}
                setValue={setFilterValue}
                placeholder={
                    <Text>
                        Filters
                        <Icon name="filter" size={16} color="black" />
                    </Text>
                }
                containerStyle={styles.dropDownContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '2%',
        zIndex: 99,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dropDownContainer: {
        flexBasis: '40%'
    }
});
