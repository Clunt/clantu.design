import './index.scss';
import dialog from '../dialog';

function Confirm(message, option, callback) {
  if (typeof option === 'function') {
    callback = option;
    option = {};
  }
  option = option || {};
  var dialogOption = {
    defaultClass: 'cd-confirm',
    class: option.class,
    title: option.title,
    buttons: [{
      sign: 'cancel',
      name: option.cancel || '取消',
      kind: 'ghost',
      size: option.size || 'small'
    }, {
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

Confirm.close = dialog.close;

export default Confirm;
