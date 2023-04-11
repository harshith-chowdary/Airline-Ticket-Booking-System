import React from 'react';
import ReactDOM from 'react-dom';


class ScrollContainer extends React.Component { 
    // https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
    // scrollToDom(element, to, duration) {
    //     if (duration <= 0) return;
    //     var difference = to - element.scrollTop;
    //     var perTick = difference / duration * 10;

    //     setTimeout(function() {
    //         element.scrollTop = element.scrollTop + perTick;
    //         if (element.scrollTop === to) return;
    //         scrollTo(element, to, duration - 10);
    //     }, 10);
    // }

    scrollTop(element, to, duration = 400) {
        const $element = element || ReactDOM.findDOMNode(this.refs.content);

        var difference = to - $element.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(() => {
            $element.scrollTop = $element.scrollTop + perTick;
            if ($element.scrollTop === to) return;
            this.scrollTop(to, duration - 10);
        }, 10);
    }

    render() {
        return (
            <div className="nano">
                <div className="nano-content" ref="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default ScrollContainer;