import './index.scss';
import dialog from '../dialog';

function Alert(message, option, callback) {
  if (typeof option === 'function') {
    callback = option;
    option = {};
  }
  option = option || {};
  var dialogOption = {
    defaultClass: 'cd-alert',
    class: option.class,
    title: option.title,
    buttons: [{
      sign: 'sure',
      name: option.sure || '确定',
      kind: option.kind || 'primary',
      size: option.size || 'small'
    }],
    closable: option.closable
  };
  dialog(message, dialogOption, function(sign) {
    if (typeof callback === 'function') {
      return callback(sign !== 'sure');
    }
  });
}

Alert.close = dialog.close;

export default Alert;
