import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Modal, Image, Dimensions } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { FONTS } from '../../Constant/Fonts';

const transparent = 'transparent';
const { height, width } = Dimensions.get("window")
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: transparent,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',

    },
    textContainer: {
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'
    },
    textContent: {
        top: 80,
        height: 50,
        fontSize: 20,
        fontFamily:FONTS.OpenSans_Bold
    },
    activityIndicator: {
        flex: 1
    },
    image: {
        height: height / 13,
        width: width / 6,
        marginTop: 2

    }
});

const ANIMATION = ['none', 'slide', 'fade'];
const SIZES = ['small', 'normal', 'large'];

export default class Spinner extends React.PureComponent {
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            visible: this.props.visible,
            textContent: this.props.textContent,
            isImageLoaded: false
        };
    }

    static propTypes = {
        cancelable: PropTypes.bool,
        color: PropTypes.string,
        animation: PropTypes.oneOf(ANIMATION),
        overlayColor: PropTypes.string,
        size: PropTypes.oneOf(SIZES),
        textContent: PropTypes.string,
        textStyle: PropTypes.object,
        visible: PropTypes.bool,
        indicatorStyle: PropTypes.object,
        customIndicator: PropTypes.element,
        children: PropTypes.element
    };

    static defaultProps = {
        visible: false,
        cancelable: false,
        textContent: '',
        animation: 'none',
        color: 'white',
        size: 'large', // 'normal',
        overlayColor: 'rgba(0, 0, 0, 0.25)'
    };

    close() {
        this.setState({ visible: false });
    }

    static getDerivedStateFromProps(props, state) {
        const newState = {};
        if (state.visible !== props.visible) newState.visible = props.visible;
        if (state.textContent !== props.textContent)
            newState.textContent = props.textContent;
        return newState;
    }

    _handleOnRequestClose() {
        if (this.props.cancelable) {
            this.close();
        }
    }

    _renderDefaultContent() {
        return (
            <View style={styles.background}>
                {this.props.customIndicator ? (
                    this.props.customIndicator
                ) : (

                    //   <View style={{ height:height/11,width:width/5.2,backgroundColor:"white",justifyContent:'center',alignItems:'center',borderRadius:35,overflow:'hidden' }}>


                    //     onLoad={ () => this.setState({ isImageLoaded: true }) }
                    //     style={[styles.image, { display: (this.state.isImageLoaded ? 'flex' : 'none') }]}
                    //      resizeMode="cover"

                    // />
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIndicator size={80} color={this.props.color} style={[styles.textContainer, { ...this.props.indicatorStyle }]} trackWidth={2} />
                        <Image
                            style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center' }}
                            source={require('../../Assets/Images/logo.png')}
                            resizeMode={'contain'}
                        />
                    </View>
                    // <ActivityIndicator
                    //   color={this.props.color}
                    //   size={80}
                    //    style={[styles.activityIndicator, { ...this.props.indicatorStyle }]}
                    //   // style={[styles.activityIndicator, { ...this.props.indicatorStyle }],{ display: (this.state.isImageLoaded ? 'none' : 'flex') }}
                    // />
                    // </View>
                )}
                <View style={[styles.textContainer, { ...this.props.indicatorStyle }]}>
                    <Text style={[styles.textContent, this.props.textStyle]}>
                        {this.state.textContent}
                    </Text>
                </View>
            </View>
        );
    }

    _renderSpinner() {
        if (!this.state.visible) return null;

        const spinner = (
            <View
                style={[styles.container, {}]}
                key={`spinner_${Date.now()}`}
            >
                {this.props.children
                    ? this.props.children
                    : this._renderDefaultContent()}
            </View>
        );

        return (
            <Modal
                animationType={this.props.animation}
                onRequestClose={() => this._handleOnRequestClose()}
                supportedOrientations={['landscape', 'portrait']}
                transparent
                visible={this.state.visible}
            >
                {spinner}
            </Modal>
        );
    }

    render() {
        return this._renderSpinner();
    }
}