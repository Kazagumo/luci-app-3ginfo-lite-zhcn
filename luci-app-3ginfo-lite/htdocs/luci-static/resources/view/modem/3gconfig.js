'use strict';
'require form';
'require fs';
'require view';
'require uci';
'require ui';
'require tools.widgets as widgets'

/*
	Copyright 2021-2023 Rafał Wabik - IceG - From eko.one.pl forum
	
	Licensed to the GNU General Public License v3.0.
*/

return view.extend({
	load: function() {
		return fs.list('/dev').then(function(devs) {
			return devs.filter(function(dev) {
				return dev.name.match(/^ttyUSB/) || dev.name.match(/^cdc-wdm/) || dev.name.match(/^ttyACM/);
			});
		});
	},

	render: function(devs) {
		var m, s, o;
		m = new form.Map('3ginfo', _('3ginfo-lite设置'), _('3ginfo-lite控制面板'));

		s = m.section(form.TypedSection, '3ginfo', '', _(''));
		s.anonymous = true;
		
		o = s.option(widgets.DeviceSelect, 'network', _('Interface'),
		_('访问互联网的接口')
		);
		o.noaliases  = false;
		o.default = 'wan';
		o.rmempty = false;

		o = s.option(form.Value, 'device', 
			_('用于和modem通讯的IP地址/端口'),
			_("选择正确的设置 <br /> \
				<br />传统modem. <br /> \
				选择正确的ttyUSBX接口 <br /> \
				<br />HiLink modem. <br /> \
				输入modem的ip地址(通常是192.168.X.X)"));
		devs.sort((a, b) => a.name > b.name);
		devs.forEach(dev => o.value('/dev/' + dev.name));
		o.placeholder = _('请选择端口');
		o.rmempty = false

		s = m.section(form.TypedSection, '3ginfo', _(''));
		s.anonymous = true;
		s.addremove = false;

		s.tab('bts1', _('BTS search settings'));
		s.anonymous = true;

		o = s.taboption('bts1', form.DummyValue, '_dummy');
			o.rawhtml = true;
			o.default = '<div class="cbi-section-descr">' +
				_('Hint: To set up a BTS search engine, all you have to do is select the dedicated website for your location.') +
				'</div>';

		o = s.taboption('bts1',form.ListValue, 'website', _('Website to search for BTS'),
		_('Select a website for searching.')
		);
		o.value('http://www.btsearch.pl/szukaj.php?mode=std&search=', _('btsearch.pl'));
		o.value('https://lteitaly.it/internal/map.php#bts=', _('lteitaly.it'));
		o.default = 'http://www.btsearch.pl/szukaj.php?mode=std&search=';
		o.modalonly = true;

		return m.render();
	}
});
