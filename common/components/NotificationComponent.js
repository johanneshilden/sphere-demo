import React              from 'react'
import NotificationSystem from 'react-notification-system'

import DataStore          from '../store/DataStore'

const defaultWidth = 320;

const defaultColors = {
    success : '#1d9d74',
    error   : '#ec3d3d',
    warning : '#ebad1a',
    info    : '#369cc7'
}

const notificationStyles = {

    Wrapper: {},

    Containers: {
        DefaultStyle: {
            fontFamily      : 'inherit',
            position        : 'fixed',
            width           : defaultWidth,
            padding         : '0 15px 10px 15px',
            zIndex          : 9998,
            WebkitBoxSizing : 'border-box',
            MozBoxSizing    : 'border-box',
            boxSizing       : 'border-box',
            height          : 'auto'
        },
        tl: {
            top             : '0px',
            bottom          : 'auto',
            left            : '0px',
            right           : 'auto'
        },
        tr: {
            top             : '80px',
            bottom          : 'auto',
            left            : 'auto',
            right           : '10px'
        },
        tc: {
            top             : '0px',
            bottom          : 'auto',
            margin          : '0 auto',
            left            : '50%',
            marginLeft      : -(defaultWidth/2)
        },
        bl: {
            top             : 'auto',
            bottom          : '0px',
            left            : '0px',
            right           : 'auto'
        },
        br: {
            top             : 'auto',
            bottom          : '0px',
            left            : 'auto',
            right           : '0px'
        },
        bc: {
            top             : 'auto',
            bottom          : '0px',
            margin          : '0 auto',
            left            : '50%',
            marginLeft      : -(defaultWidth/2)
        }
    },

    NotificationItem: {
        DefaultStyle: {
            position        : 'relative',
            width           : '100%',
            cursor          : 'pointer',
            borderRadius    : '0',
            fontSize        : '16px',
            border          : '1px solid green',
            borderTopWidth  : '1',
            margin          : '10px 0 0',
            padding         : '16px 20px',
            display         : 'block',
            WebkitBoxSizing : 'border-box',
            MozBoxSizing    : 'border-box',
            boxSizing       : 'border-box',
            WebkitBoxShadow : 'none',
            MozBoxShadow    : 'none',
            boxShadow       : 'none',
            opacity         : 0,
            transition      : '0.3s ease-in-out',

            isHidden: {
                opacity: 0
            },
    
            isVisible: {
                opacity: 1
            }
        },
    
        success: {
            borderColor     : '#bbe2d5',
            borderTopColor  : '#bbe2d5',
            backgroundColor : '#f1f9f7',
            color           : '#1d9d74'
        },
    
        error: {
            borderColor     : '#edbfbf',
            borderTopColor  : defaultColors.error,
            backgroundColor : '#f4e9e9',
            color           : '#412f2f'
        },
    
        warning: {
            borderColor     : '#ecd9ab',
            borderTopColor  : '#ecd9ab',
            backgroundColor : '#f9f6f0',
            color           : '#dc861a'
        },
    
        info: {
            borderColor     : '#b2d0dd',
            borderTopColor  : defaultColors.info,
            backgroundColor : '#e8f0f4',
            color           : '#41555d'
        }
    },

    Title: {
        DefaultStyle: {
            fontSize   : '16px',
            margin     : '0 0 15px 0',
            padding    : 0,
            fontWeight : 'bold'
        },

        success: {
            color: defaultColors.success
        },

        error: {
            color: defaultColors.error
        },

        warning: {
            color: defaultColors.warning
        },

        info: {
            color: defaultColors.info
        }

    },

    MessageWrapper: {
        DefaultStyle: {
            margin   : 0,
            padding  : 0
        }
    },

    Dismiss: {
        DefaultStyle: {
            fontFamily      : 'Arial',
            fontSize        : '24px',
            position        : 'absolute',
            top             : '8px',
            right           : '8px',
            lineHeight      : '15px',
            backgroundColor : '#dededf',
            color           : '#ffffff',
            borderRadius    : '50%',
            width           : '14px',
            height          : '14px',
            fontWeight      : 'bold',
            textAlign       : 'center'
        },

        success: {
            color           : '#1d9d74',
            backgroundColor : 'transparent'
        },

        error: {
            color           : '#f4e9e9',
            backgroundColor : '#e4bebe'
        },

        warning: {
            color           : '#dc861a',
            backgroundColor : 'transparent'
        },

        info: {
            color           : '#e8f0f4',
            backgroundColor : '#a4becb'
        }
    },

    Action: {
        DefaultStyle: {
            background      : '#ffffff',
            borderRadius    : '2px',
            padding         : '6px 20px',
            fontWeight      : 'bold',
            margin          : '10px 0 0 0',
            border          : 0
        },

        success: {
            backgroundColor : defaultColors.success,
            color           : '#ffffff'
        },
    
        error: {
            backgroundColor : defaultColors.error,
            color           : '#ffffff'
        },
    
        warning: {
            backgroundColor : defaultColors.warning,
            color           : '#ffffff'
        },
    
        info: {
              backgroundColor : defaultColors.info,
              color           : '#ffffff'
        }
    },

    ActionWrapper: {
        DefaultStyle: {
            margin   : 0,
            padding  : 0
        }
    }

}

const NotificationComponent = React.createClass({
    componentDidMount: function() {
        DataStore.on('notification', this.addNotification)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('notification', this.addNotification)
    },
    addNotification: function(notification) {
        this.refs.notifications.addNotification(notification)
    },
    render: function() {
        return (
            <NotificationSystem 
              style = {notificationStyles}
              ref   = 'notifications' />
        )
    }
})

module.exports = NotificationComponent
