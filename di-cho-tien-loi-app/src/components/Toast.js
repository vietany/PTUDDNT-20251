import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const Toast = ({ message, type = 'success', onHide }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onHide) onHide();
        });
    }, []);

    if (!message) return null;

    const bg = type === 'success' ? '#27ae60' : '#c0392b';
    const icon = type === 'success' ? '✅' : '❌';

    return (
        <Animated.View style={[styles.container, { opacity, backgroundColor: bg }]}>
            <Text style={styles.text}>{icon} {message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    }
});

export default Toast;
