function parsePreprocessor(file, settings = [], callback) {
	const defineregex = /^[\s]*#define[\s]+(?<def>[\w\d]+)[\s]+(?<val>[\-\w\d]+|"[^"]+")?/gm
	var txtFile = new XMLHttpRequest();
	txtFile.open("GET", file, true);
	txtFile.onreadystatechange = function () {
		if (txtFile.readyState === 4 && txtFile.status === 200) {  // Makes sure it's found the file.
			allText = txtFile.responseText;
			const matches = [...allText.matchAll(defineregex)];
			for (var i = 0; i < matches.length; i++) {
				settings[matches[i][1]] = matches[i][2];
			}
			if (callback) {
				callback(settings);
			}
		}
	}
	txtFile.send(null);
}

function updateBoardmap() {
	var settings = [];
	var url = "https://raw.githubusercontent.com/Paciente8159/uCNC/" + version + "/uCNC/src/hal/boards/";
	switch (document.querySelector('#BOARD').value) {
		case 'BOARD_UNO':
		case 'BOARD_MKS_DLC':
		case 'BOARD_X_CONTROLLER':
			url = url + "avr/boardmap_uno.h";
			break;
		case 'BOARD_RAMBO14':
		case 'BOARD_MKS_GEN_L_V1':
			url = url + "avr/boardmap_rambo14.h";
			break;
		case 'BOARD_RAMPS14':
			url = url + "avr/boardmap_ramps14.h";
			break;
		case 'BOARD_BLUEPILL':
			url = url + "stm32/boardmap_bluepill.h";
			break;
		case 'BOARD_BLACKPILL':
			url = url + "stm32/boardmap_blackpill.h";
			break;
		case 'BOARD_MKS_ROBIN_NANO_V1_2':
			url = url + "stm32/boardmap_mks_robin_nano_v1_2.h";
			break;
		case 'BOARD_SKR_PRO_V1_2':
			url = url + "stm32/boardmap_srk_pro_v1_2.h";
			break;
		case 'BOARD_MZERO':
			url = url + "samd21/boardmap_mzero.h";
			break;
		case 'BOARD_ZERO':
			url = url + "samd21/boardmap_zero.h";
			break;
		case 'BOARD_RE_ARM':
			url = url + "lpc176x/boardmap_re_arm.h";
			break;
		case 'BOARD_MKS_BASE13':
			url = url + "lpc176x/boardmap_mks_base13.h";
			break;
		case 'BOARD_SKR_V14_TURBO':
			url = url + "lpc176x/boardmap_skr_v14_turbo.h";
			break;
		case 'BOARD_WEMOS_D1':
			url = url + "boardmap_wemos_d1.h";
			break;
		case 'BOARD_WEMOS_D1_R32':
			url = url + "esp32/boardmap_wemos_d1_r32.h";
			break;
		case 'BOARD_MKS_TINYBEE':
			url = url + "esp32/boardmap_mks_tinybee.h";
			break;
		case 'BOARD_MKS_DLC32':
			url = url + "esp32/boardmap_mks_dlc32.h";
			break;
		default:
			return;
	}

	parsePreprocessor(url, settings, function (newsettings) {
		settings = newsettings;
		for (var s in settings) {
			if (settings.hasOwnProperty(s)) {
				var node = document.querySelector("#" + s);
				if (node) {
					switch (node.type) {
						case 'select-one':
							node.value = settings[s];
							break;
						case 'checkbox':
							node.checked = true;
							break;
						default:
							node.value = settings[s];
							break;
					}
				}
			}
		}
	});
}

var version = 'v1.5.4';
var app = angular.module("uCNCapp", []);
var controller = app.controller('uCNCcontroller', ['$scope', '$rootScope', function ($scope, $rootScope) {
	$scope.MCUS = [
		{ id: 'MCU_AVR', name: 'Atmel AVR' },
		{ id: 'MCU_SAMD21', name: 'Atmel SAMD21' },
		{ id: 'MCU_STM32F1X', name: 'STM32F1x' },
		{ id: 'MCU_STM32F4X', name: 'STM32F4X' },
		{ id: 'MCU_LPC176X', name: 'LPC176X' },
		{ id: 'MCU_ESP8266', name: 'ESP8266' },
		{ id: 'MCU_ESP32', name: 'ESP32' }
	];
	$scope.KINEMATICS = [
		{ id: 'KINEMATIC_CARTESIAN', name: 'Cartesian' },
		{ id: 'KINEMATIC_COREXY', name: 'Core XY' },
		{ id: 'KINEMATIC_DELTA', name: 'Linear delta' }
	];

	$scope.BOARDS = [
		{ id: 'BOARD_UNO', name: 'Arduino UNO', mcu: 'MCU_AVR' },
		{ id: 'BOARD_RAMBO14', name: 'Rambo v1.4', mcu: 'MCU_AVR' },
		{ id: 'BOARD_RAMPS14', name: 'Arduino MEGA/RAMPS v1.4', mcu: 'MCU_AVR' },
		{ id: 'BOARD_MKS_DLC', name: 'MKS DLC', mcu: 'MCU_AVR' },
		{ id: 'BOARD_X_CONTROLLER', name: 'X-Controller', mcu: 'MCU_AVR' },
		{ id: 'BOARD_MKS_GEN_L_V1', name: 'MKS Gen L v1', mcu: 'MCU_AVR' },
		{ id: 'BOARD_BLUEPILL', name: 'Bluepill STM32F103', mcu: 'MCU_STM32F1X' },
		{ id: 'BOARD_BLACKPILL', name: 'Blackpill STM32F401', mcu: 'MCU_STM32F4X' },
		{ id: 'BOARD_MKS_ROBIN_NANO_V1_2', name: 'MKS Robin Nano v1.2', mcu: 'MCU_STM32F1X' },
		{ id: 'BOARD_SKR_PRO_V1_2', name: 'SKR Pro v1.2', mcu: 'MCU_STM32F4X' },
		{ id: 'BOARD_MZERO', name: 'Arduino M0', mcu: 'MCU_SAMD21' },
		{ id: 'BOARD_ZERO', name: 'Arduino Zero', mcu: 'MCU_SAMD21' },
		{ id: 'BOARD_RE_ARM', name: 'Panukatt RE-ARM', mcu: 'MCU_LPC176X' },
		{ id: 'BOARD_MKS_BASE13', name: 'MKS Base v1.3', mcu: 'MCU_LPC176X' },
		{ id: 'BOARD_SKR_V14_TURBO', name: 'SKR v1.4 Turbo', mcu: 'MCU_LPC176X' },
		{ id: 'BOARD_WEMOS_D1', name: 'Wemos D1', mcu: 'MCU_ESP8266' },
		{ id: 'BOARD_WEMOS_D1_R32', name: 'Wemos D1 R32', mcu: 'MCU_ESP32' },
		{ id: 'BOARD_MKS_TINYBEE', name: 'MKS Tinybee', mcu: 'MCU_ESP32' },
		{ id: 'BOARD_MKS_DLC32', name: 'MKS DLC32', mcu: 'MCU_ESP32' },
		{ id: 'BOARD_CUSTOM', name: 'Custom board', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' }
	];

	$scope.UCNCPINS = [
		{ pin: 'STEP0', type: 'special output' },
		{ pin: 'STEP1', type: 'special output' },
		{ pin: 'STEP2', type: 'special output' },
		{ pin: 'STEP3', type: 'special output' },
		{ pin: 'STEP4', type: 'special output' },
		{ pin: 'STEP5', type: 'special output' },
		{ pin: 'STEP6', type: 'special output' },
		{ pin: 'STEP7', type: 'special output' },
		{ pin: 'DIR0', type: 'special output' },
		{ pin: 'DIR1', type: 'special output' },
		{ pin: 'DIR2', type: 'special output' },
		{ pin: 'DIR3', type: 'special output' },
		{ pin: 'DIR4', type: 'special output' },
		{ pin: 'DIR5', type: 'special output' },
		{ pin: 'DIR6', type: 'special output' },
		{ pin: 'DIR7', type: 'special output' },
		{ pin: 'STEP0_EN', type: 'special output' },
		{ pin: 'STEP1_EN', type: 'special output' },
		{ pin: 'STEP2_EN', type: 'special output' },
		{ pin: 'STEP3_EN', type: 'special output' },
		{ pin: 'STEP4_EN', type: 'special output' },
		{ pin: 'STEP5_EN', type: 'special output' },
		{ pin: 'STEP6_EN', type: 'special output' },
		{ pin: 'STEP7_EN', type: 'special output' },
		{ pin: 'PWM0', type: 'pwm' },
		{ pin: 'PWM1', type: 'pwm' },
		{ pin: 'PWM2', type: 'pwm' },
		{ pin: 'PWM3', type: 'pwm' },
		{ pin: 'PWM4', type: 'pwm' },
		{ pin: 'PWM5', type: 'pwm' },
		{ pin: 'PWM6', type: 'pwm' },
		{ pin: 'PWM7', type: 'pwm' },
		{ pin: 'PWM8', type: 'pwm' },
		{ pin: 'PWM9', type: 'pwm' },
		{ pin: 'PWM10', type: 'pwm' },
		{ pin: 'PWM11', type: 'pwm' },
		{ pin: 'PWM12', type: 'pwm' },
		{ pin: 'PWM13', type: 'pwm' },
		{ pin: 'PWM14', type: 'pwm' },
		{ pin: 'PWM15', type: 'pwm' },
		{ pin: 'SERVO0', type: 'special output' },
		{ pin: 'SERVO1', type: 'special output' },
		{ pin: 'SERVO2', type: 'special output' },
		{ pin: 'SERVO3', type: 'special output' },
		{ pin: 'SERVO4', type: 'special output' },
		{ pin: 'SERVO5', type: 'special output' },
		{ pin: 'DOUT0', type: 'output' },
		{ pin: 'DOUT1', type: 'output' },
		{ pin: 'DOUT2', type: 'output' },
		{ pin: 'DOUT3', type: 'output' },
		{ pin: 'DOUT4', type: 'output' },
		{ pin: 'DOUT5', type: 'output' },
		{ pin: 'DOUT6', type: 'output' },
		{ pin: 'DOUT7', type: 'output' },
		{ pin: 'DOUT8', type: 'output' },
		{ pin: 'DOUT9', type: 'output' },
		{ pin: 'DOUT10', type: 'output' },
		{ pin: 'DOUT11', type: 'output' },
		{ pin: 'DOUT12', type: 'output' },
		{ pin: 'DOUT13', type: 'output' },
		{ pin: 'DOUT14', type: 'output' },
		{ pin: 'DOUT15', type: 'output' },
		{ pin: 'DOUT16', type: 'output' },
		{ pin: 'DOUT17', type: 'output' },
		{ pin: 'DOUT18', type: 'output' },
		{ pin: 'DOUT19', type: 'output' },
		{ pin: 'DOUT20', type: 'output' },
		{ pin: 'DOUT21', type: 'output' },
		{ pin: 'DOUT22', type: 'output' },
		{ pin: 'DOUT23', type: 'output' },
		{ pin: 'DOUT24', type: 'output' },
		{ pin: 'DOUT25', type: 'output' },
		{ pin: 'DOUT26', type: 'output' },
		{ pin: 'DOUT27', type: 'output' },
		{ pin: 'DOUT28', type: 'output' },
		{ pin: 'DOUT29', type: 'output' },
		{ pin: 'DOUT30', type: 'output' },
		{ pin: 'DOUT31', type: 'output' },
		{ pin: 'LIMIT_X', type: 'input_interruptable' },
		{ pin: 'LIMIT_Y', type: 'input_interruptable' },
		{ pin: 'LIMIT_Z', type: 'input_interruptable' },
		{ pin: 'LIMIT_X2', type: 'input_interruptable' },
		{ pin: 'LIMIT_Y2', type: 'input_interruptable' },
		{ pin: 'LIMIT_Z2', type: 'input_interruptable' },
		{ pin: 'LIMIT_A', type: 'input_interruptable' },
		{ pin: 'LIMIT_B', type: 'input_interruptable' },
		{ pin: 'LIMIT_C', type: 'input_interruptable' },
		{ pin: 'PROBE', type: 'input_interruptable' },
		{ pin: 'ESTOP', type: 'input_interruptable' },
		{ pin: 'SAFETY_DOOR', type: 'input_interruptable' },
		{ pin: 'FHOLD', type: 'input_interruptable' },
		{ pin: 'CS_RES', type: 'input_interruptable' },
		{ pin: 'ANALOG0', type: 'analog' },
		{ pin: 'ANALOG1', type: 'analog' },
		{ pin: 'ANALOG2', type: 'analog' },
		{ pin: 'ANALOG3', type: 'analog' },
		{ pin: 'ANALOG4', type: 'analog' },
		{ pin: 'ANALOG5', type: 'analog' },
		{ pin: 'ANALOG6', type: 'analog' },
		{ pin: 'ANALOG7', type: 'analog' },
		{ pin: 'ANALOG8', type: 'analog' },
		{ pin: 'ANALOG9', type: 'analog' },
		{ pin: 'ANALOG10', type: 'analog' },
		{ pin: 'ANALOG11', type: 'analog' },
		{ pin: 'ANALOG12', type: 'analog' },
		{ pin: 'ANALOG13', type: 'analog' },
		{ pin: 'ANALOG14', type: 'analog' },
		{ pin: 'ANALOG15', type: 'analog' },
		{ pin: 'DIN0', type: 'input_interruptable' },
		{ pin: 'DIN1', type: 'input_interruptable' },
		{ pin: 'DIN2', type: 'input_interruptable' },
		{ pin: 'DIN3', type: 'input_interruptable' },
		{ pin: 'DIN4', type: 'input_interruptable' },
		{ pin: 'DIN5', type: 'input_interruptable' },
		{ pin: 'DIN6', type: 'input_interruptable' },
		{ pin: 'DIN7', type: 'input_interruptable' },
		{ pin: 'DIN8', type: 'input' },
		{ pin: 'DIN9', type: 'input' },
		{ pin: 'DIN10', type: 'input' },
		{ pin: 'DIN11', type: 'input' },
		{ pin: 'DIN12', type: 'input' },
		{ pin: 'DIN13', type: 'input' },
		{ pin: 'DIN14', type: 'input' },
		{ pin: 'DIN15', type: 'input' },
		{ pin: 'DIN16', type: 'input' },
		{ pin: 'DIN17', type: 'input' },
		{ pin: 'DIN18', type: 'input' },
		{ pin: 'DIN19', type: 'input' },
		{ pin: 'DIN20', type: 'input' },
		{ pin: 'DIN21', type: 'input' },
		{ pin: 'DIN22', type: 'input' },
		{ pin: 'DIN23', type: 'input' },
		{ pin: 'DIN24', type: 'input' },
		{ pin: 'DIN25', type: 'input' },
		{ pin: 'DIN26', type: 'input' },
		{ pin: 'DIN27', type: 'input' },
		{ pin: 'DIN28', type: 'input' },
		{ pin: 'DIN29', type: 'input' },
		{ pin: 'DIN30', type: 'input' },
		{ pin: 'DIN31', type: 'input' },
		{ pin: 'TX', type: 'special output' },
		{ pin: 'RX', type: 'special input' },
		{ pin: 'USB_DM', type: 'special output' },
		{ pin: 'USB_DP', type: 'special output' },
		{ pin: 'SPI_CLK', type: 'special output' },
		{ pin: 'SPI_SDI', type: 'special input' },
		{ pin: 'SPI_SDO', type: 'special output' },
		{ pin: 'SPI_CS', type: 'special output' },
		{ pin: 'I2C_SCL', type: 'special input' },
		{ pin: 'I2C_SDA', type: 'special input' }
	];

	$scope.PINS = [
		{ pin: 0, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 1, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 2, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 3, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 4, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 5, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 6, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 7, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 8, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 9, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 10, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 11, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 12, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 13, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 14, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 15, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 16, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP32' },
		{ pin: 17, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP33' },
		{ pin: 18, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP34' },
		{ pin: 19, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP35' },
		{ pin: 20, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP36' },
		{ pin: 21, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP37' },
		{ pin: 22, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP38' },
		{ pin: 23, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP39' },
		{ pin: 24, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP40' },
		{ pin: 25, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP41' },
		{ pin: 26, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP42' },
		{ pin: 27, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP43' },
		{ pin: 28, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP44' },
		{ pin: 29, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP45' },
		{ pin: 30, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP46' },
		{ pin: 31, mcu: 'MCU_SAMD21,MCU_LPC176X,MCU_ESP8266,MCU_ESP47' }
	];

	$scope.PORTS = [
		{ port: 'A', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'B', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'C', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'D', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'E', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'F', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'G', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'H', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'I', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'J', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'K', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'L', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'M', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: 'N', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ port: '0', mcu: 'MCU_LPC176X' },
		{ port: '1', mcu: 'MCU_LPC176X' },
		{ port: '2', mcu: 'MCU_LPC176X' }
	];

	$scope.ISRS = [
		{ isr: 0, mcu: 'MCU_AVR' },
		{ isr: 1, mcu: 'MCU_AVR' },
		{ isr: 2, mcu: 'MCU_AVR' },
		{ isr: -1, mcu: 'MCU_AVR' },
		{ isr: -2, mcu: 'MCU_AVR' },
		{ isr: -3, mcu: 'MCU_AVR' },
		{ isr: -4, mcu: 'MCU_AVR' },
		{ isr: -5, mcu: 'MCU_AVR' },
		{ isr: -6, mcu: 'MCU_AVR' },
		{ isr: -7, mcu: 'MCU_AVR' },
		{ isr: -8, mcu: 'MCU_AVR' }
	];

	$scope.CHANNELS = [
		{ channel: 0, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 1, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 2, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 3, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 4, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 5, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 6, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 7, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 8, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 9, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 10, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 11, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 12, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 13, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 14, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 15, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ channel: 'A', mcu: 'MCU_AVR' },
		{ channel: 'B', mcu: 'MCU_AVR' },
		{ channel: 'C', mcu: 'MCU_AVR' },
		{ channel: 'D', mcu: 'MCU_AVR' }
	];

	$scope.TIMERS = [
		{ timer: 0, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ timer: 1, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ timer: 2, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ timer: 3, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X' },
		{ timer: 4, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 5, mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 6, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 7, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 8, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 9, mcu: 'MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 10, mcu: 'MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 11, mcu: 'MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 12, mcu: 'MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 13, mcu: 'MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 14, mcu: 'MCU_STM32F1X,MCU_STM32F4X' },
		{ timer: 15, mcu: 'MCU_STM32F1X,MCU_STM32F4X' }
	];

	$scope.UCNCTIMERS = [
		{ timer: 'ITP', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,ESP32' },
		{ timer: 'RTC', mcu: 'MCU_AVR' },
		{ timer: 'SERVO', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,ESP32' },
		{ timer: 'ONESHOT', mcu: 'MCU_AVR,MCU_SAMD21,MCU_STM32F1X,MCU_STM32F4X,MCU_LPC176X,ESP32' }
	];

	$scope.MUXS = [
		{ mux: 'A', mcu: 'MCU_SAMD21' },
		{ mux: 'B', mcu: 'MCU_SAMD21' },
		{ mux: 'C', mcu: 'MCU_SAMD21' },
		{ mux: 'D', mcu: 'MCU_SAMD21' },
		{ mux: 'E', mcu: 'MCU_SAMD21' },
		{ mux: 'F', mcu: 'MCU_SAMD21' },
		{ mux: 'G', mcu: 'MCU_SAMD21' },
		{ mux: 'H', mcu: 'MCU_SAMD21' }
	];

	$scope.CONTROLS = [
		'ESTOP',
		'SAFETY_DOOR',
		'FHOLD',
		'CS_RES'
	];

	$scope.LIMITS = [
		{ limit: 'LIMIT_X', axis: '1,2,3,4,5,6' },
		{ limit: 'LIMIT_Y', axis: '2,3,4,5,6' },
		{ limit: 'LIMIT_Z', axis: '3,4,5,6' },
		{ limit: 'LIMIT_X2', axis: '1,2,3,4,5,6' },
		{ limit: 'LIMIT_Y2', axis: '2,3,4,5,6' },
		{ limit: 'LIMIT_Z2', axis: '3,4,5,6' },
		{ limit: 'LIMIT_A', axis: '4,5,6' },
		{ limit: 'LIMIT_B', axis: '5,6' },
		{ limit: 'LIMIT_C', axis: '6' },
	];

	$scope.TOOLS = [
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16
	];

	$scope.MCU = "MCU_AVR";
	$scope.BOARD = "BOARD_UNO";
	$scope.KINEMATIC = "KINEMATIC_CARTESIAN";
	$scope.AXIS_COUNT = '3';
	$scope.TOOL_COUNT = 1;

	$scope.numSmallerOrEq = function (arr, ref) {
		var refval = document.querySelector("#" + ref);
		if (!refval) {
			return [];
		}
		const res = arr.filter(val => val <= parseInt(refval.value));
		return res;
	}

	$scope.boardChanged = updateBoardmap;
}]);

app.directive('ngModelDynamic', ['$compile',
	function ($compile) {
		return {

			restrict: 'A',
			link: function (scope, element, attrs) {
				// Remove ng-model-dynamic to prevent recursive compilation
				element.removeAttr('ng-model-dynamic');

				// Add ng-model with a value set to the now evaluated expression
				element.attr('ng-model', attrs.ngModelDynamic);

				// Recompile the entire element
				$compile(element)(scope);
			}

		}
	}]);

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function generate_user_config(options, defguard) {
	var gentext = '#ifndef ' + defguard + '\n#define ' + defguard + '\n#ifdef __cplusplus\nextern "C"\n{\n#endif\n';

	for (var i = 0; i < options.length; i++) {
		var node = document.querySelector("#" + options[i]);
		if (node) {
			gentext += "#ifdef " + options[i] + "\n#undef " + options[i] + "\n#endif\n";
			switch (node.type) {
				case 'select-one':
					if (node.value !== '? undefined:undefined ?') {
						gentext += "#define " + options[i] + " " + node.value + "\n";
					}
					break;
				case 'checkbox':
					if (node.checked) {
						gentext += "#define " + options[i] + "\n";
					}
					break;
				default:
					gentext += "#define " + options[i] + " " + node.value + "\n";
					break;
			}
		}

	}

	gentext += '\n#ifdef __cplusplus\n}\n#endif\n#endif\n';
	return gentext;
}

function ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(function () {
	updateBoardmap();
});

document.querySelector('#boardmap_overrides').addEventListener('click', function () {
	var options = [
		'BOARD',
		'MCU',
		'KINEMATIC',
		'AXIS_COUNT',
		'TOOL_COUNT',
		'STEP0_BIT',
		'STEP1_BIT',
		'STEP2_BIT',
		'STEP3_BIT',
		'STEP4_BIT',
		'STEP5_BIT',
		'STEP6_BIT',
		'STEP7_BIT',
		'DIR0_BIT',
		'DIR1_BIT',
		'DIR2_BIT',
		'DIR3_BIT',
		'DIR4_BIT',
		'DIR5_BIT',
		'DIR6_BIT',
		'DIR7_BIT',
		'STEP0_EN_BIT',
		'STEP1_EN_BIT',
		'STEP2_EN_BIT',
		'STEP3_EN_BIT',
		'STEP4_EN_BIT',
		'STEP5_EN_BIT',
		'STEP6_EN_BIT',
		'STEP7_EN_BIT',
		'PWM0_BIT',
		'PWM1_BIT',
		'PWM2_BIT',
		'PWM3_BIT',
		'PWM4_BIT',
		'PWM5_BIT',
		'PWM6_BIT',
		'PWM7_BIT',
		'PWM8_BIT',
		'PWM9_BIT',
		'PWM10_BIT',
		'PWM11_BIT',
		'PWM12_BIT',
		'PWM13_BIT',
		'PWM14_BIT',
		'PWM15_BIT',
		'SERVO0_BIT',
		'SERVO1_BIT',
		'SERVO2_BIT',
		'SERVO3_BIT',
		'SERVO4_BIT',
		'SERVO5_BIT',
		'DOUT0_BIT',
		'DOUT1_BIT',
		'DOUT2_BIT',
		'DOUT3_BIT',
		'DOUT4_BIT',
		'DOUT5_BIT',
		'DOUT6_BIT',
		'DOUT7_BIT',
		'DOUT8_BIT',
		'DOUT9_BIT',
		'DOUT10_BIT',
		'DOUT11_BIT',
		'DOUT12_BIT',
		'DOUT13_BIT',
		'DOUT14_BIT',
		'DOUT15_BIT',
		'DOUT16_BIT',
		'DOUT17_BIT',
		'DOUT18_BIT',
		'DOUT19_BIT',
		'DOUT20_BIT',
		'DOUT21_BIT',
		'DOUT22_BIT',
		'DOUT23_BIT',
		'DOUT24_BIT',
		'DOUT25_BIT',
		'DOUT26_BIT',
		'DOUT27_BIT',
		'DOUT28_BIT',
		'DOUT29_BIT',
		'DOUT30_BIT',
		'DOUT31_BIT',
		'LIMIT_X_BIT',
		'LIMIT_Y_BIT',
		'LIMIT_Z_BIT',
		'LIMIT_X2_BIT',
		'LIMIT_Y2_BIT',
		'LIMIT_Z2_BIT',
		'LIMIT_A_BIT',
		'LIMIT_B_BIT',
		'LIMIT_C_BIT',
		'PROBE_BIT',
		'ESTOP_BIT',
		'SAFETY_DOOR_BIT',
		'FHOLD_BIT',
		'CS_RES_BIT',
		'ANALOG0_BIT',
		'ANALOG1_BIT',
		'ANALOG2_BIT',
		'ANALOG3_BIT',
		'ANALOG4_BIT',
		'ANALOG5_BIT',
		'ANALOG6_BIT',
		'ANALOG7_BIT',
		'ANALOG8_BIT',
		'ANALOG9_BIT',
		'ANALOG10_BIT',
		'ANALOG11_BIT',
		'ANALOG12_BIT',
		'ANALOG13_BIT',
		'ANALOG14_BIT',
		'ANALOG15_BIT',
		'DIN0_BIT',
		'DIN1_BIT',
		'DIN2_BIT',
		'DIN3_BIT',
		'DIN4_BIT',
		'DIN5_BIT',
		'DIN6_BIT',
		'DIN7_BIT',
		'DIN8_BIT',
		'DIN9_BIT',
		'DIN10_BIT',
		'DIN11_BIT',
		'DIN12_BIT',
		'DIN13_BIT',
		'DIN14_BIT',
		'DIN15_BIT',
		'DIN16_BIT',
		'DIN17_BIT',
		'DIN18_BIT',
		'DIN19_BIT',
		'DIN20_BIT',
		'DIN21_BIT',
		'DIN22_BIT',
		'DIN23_BIT',
		'DIN24_BIT',
		'DIN25_BIT',
		'DIN26_BIT',
		'DIN27_BIT',
		'DIN28_BIT',
		'DIN29_BIT',
		'DIN30_BIT',
		'DIN31_BIT',
		'TX_BIT',
		'RX_BIT',
		'USB_DM_BIT',
		'USB_DP_BIT',
		'SPI_CLK_BIT',
		'SPI_SDI_BIT',
		'SPI_SDO_BIT',
		'SPI_CS_BIT',
		'I2C_SCL_BIT',
		'I2C_SDA_BIT',
		'STEP0_PORT',
		'STEP1_PORT',
		'STEP2_PORT',
		'STEP3_PORT',
		'STEP4_PORT',
		'STEP5_PORT',
		'STEP6_PORT',
		'STEP7_PORT',
		'DIR0_PORT',
		'DIR1_PORT',
		'DIR2_PORT',
		'DIR3_PORT',
		'DIR4_PORT',
		'DIR5_PORT',
		'DIR6_PORT',
		'DIR7_PORT',
		'STEP0_EN_PORT',
		'STEP1_EN_PORT',
		'STEP2_EN_PORT',
		'STEP3_EN_PORT',
		'STEP4_EN_PORT',
		'STEP5_EN_PORT',
		'STEP6_EN_PORT',
		'STEP7_EN_PORT',
		'PWM0_PORT',
		'PWM1_PORT',
		'PWM2_PORT',
		'PWM3_PORT',
		'PWM4_PORT',
		'PWM5_PORT',
		'PWM6_PORT',
		'PWM7_PORT',
		'PWM8_PORT',
		'PWM9_PORT',
		'PWM10_PORT',
		'PWM11_PORT',
		'PWM12_PORT',
		'PWM13_PORT',
		'PWM14_PORT',
		'PWM15_PORT',
		'SERVO0_PORT',
		'SERVO1_PORT',
		'SERVO2_PORT',
		'SERVO3_PORT',
		'SERVO4_PORT',
		'SERVO5_PORT',
		'DOUT0_PORT',
		'DOUT1_PORT',
		'DOUT2_PORT',
		'DOUT3_PORT',
		'DOUT4_PORT',
		'DOUT5_PORT',
		'DOUT6_PORT',
		'DOUT7_PORT',
		'DOUT8_PORT',
		'DOUT9_PORT',
		'DOUT10_PORT',
		'DOUT11_PORT',
		'DOUT12_PORT',
		'DOUT13_PORT',
		'DOUT14_PORT',
		'DOUT15_PORT',
		'DOUT16_PORT',
		'DOUT17_PORT',
		'DOUT18_PORT',
		'DOUT19_PORT',
		'DOUT20_PORT',
		'DOUT21_PORT',
		'DOUT22_PORT',
		'DOUT23_PORT',
		'DOUT24_PORT',
		'DOUT25_PORT',
		'DOUT26_PORT',
		'DOUT27_PORT',
		'DOUT28_PORT',
		'DOUT29_PORT',
		'DOUT30_PORT',
		'DOUT31_PORT',
		'LIMIT_X_PORT',
		'LIMIT_Y_PORT',
		'LIMIT_Z_PORT',
		'LIMIT_X2_PORT',
		'LIMIT_Y2_PORT',
		'LIMIT_Z2_PORT',
		'LIMIT_A_PORT',
		'LIMIT_B_PORT',
		'LIMIT_C_PORT',
		'PROBE_PORT',
		'ESTOP_PORT',
		'SAFETY_DOOR_PORT',
		'FHOLD_PORT',
		'CS_RES_PORT',
		'ANALOG0_PORT',
		'ANALOG1_PORT',
		'ANALOG2_PORT',
		'ANALOG3_PORT',
		'ANALOG4_PORT',
		'ANALOG5_PORT',
		'ANALOG6_PORT',
		'ANALOG7_PORT',
		'ANALOG8_PORT',
		'ANALOG9_PORT',
		'ANALOG10_PORT',
		'ANALOG11_PORT',
		'ANALOG12_PORT',
		'ANALOG13_PORT',
		'ANALOG14_PORT',
		'ANALOG15_PORT',
		'DIN0_PORT',
		'DIN1_PORT',
		'DIN2_PORT',
		'DIN3_PORT',
		'DIN4_PORT',
		'DIN5_PORT',
		'DIN6_PORT',
		'DIN7_PORT',
		'DIN8_PORT',
		'DIN9_PORT',
		'DIN10_PORT',
		'DIN11_PORT',
		'DIN12_PORT',
		'DIN13_PORT',
		'DIN14_PORT',
		'DIN15_PORT',
		'DIN16_PORT',
		'DIN17_PORT',
		'DIN18_PORT',
		'DIN19_PORT',
		'DIN20_PORT',
		'DIN21_PORT',
		'DIN22_PORT',
		'DIN23_PORT',
		'DIN24_PORT',
		'DIN25_PORT',
		'DIN26_PORT',
		'DIN27_PORT',
		'DIN28_PORT',
		'DIN29_PORT',
		'DIN30_PORT',
		'DIN31_PORT',
		'TX_PORT',
		'RX_PORT',
		'USB_DM_PORT',
		'USB_DP_PORT',
		'SPI_CLK_PORT',
		'SPI_SDI_PORT',
		'SPI_SDO_PORT',
		'SPI_CS_PORT',
		'I2C_SCL_PORT',
		'I2C_SDA_PORT',
		'LIMIT_X_PULLUP',
		'LIMIT_Y_PULLUP',
		'LIMIT_Z_PULLUP',
		'LIMIT_X2_PULLUP',
		'LIMIT_Y2_PULLUP',
		'LIMIT_Z2_PULLUP',
		'LIMIT_A_PULLUP',
		'LIMIT_B_PULLUP',
		'LIMIT_C_PULLUP',
		'PROBE_PULLUP',
		'ESTOP_PULLUP',
		'SAFETY_DOOR_PULLUP',
		'FHOLD_PULLUP',
		'CS_RES_PULLUP',
		'DIN0_PULLUP',
		'DIN1_PULLUP',
		'DIN2_PULLUP',
		'DIN3_PULLUP',
		'DIN4_PULLUP',
		'DIN5_PULLUP',
		'DIN6_PULLUP',
		'DIN7_PULLUP',
		'DIN8_PULLUP',
		'DIN9_PULLUP',
		'DIN10_PULLUP',
		'DIN11_PULLUP',
		'DIN12_PULLUP',
		'DIN13_PULLUP',
		'DIN14_PULLUP',
		'DIN15_PULLUP',
		'DIN16_PULLUP',
		'DIN17_PULLUP',
		'DIN18_PULLUP',
		'DIN19_PULLUP',
		'DIN20_PULLUP',
		'DIN21_PULLUP',
		'DIN22_PULLUP',
		'DIN23_PULLUP',
		'DIN24_PULLUP',
		'DIN25_PULLUP',
		'DIN26_PULLUP',
		'DIN27_PULLUP',
		'DIN28_PULLUP',
		'DIN29_PULLUP',
		'DIN30_PULLUP',
		'DIN31_PULLUP',
		'RX_PULLUP',
		'USB_DM_PULLUP',
		'USB_DP_PULLUP',
		'SPI_SDI_PULLUP',
		'I2C_SCL_PULLUP',
		'I2C_SDA_PULLUP',
		'LIMIT_X_ISR',
		'LIMIT_Y_ISR',
		'LIMIT_Z_ISR',
		'LIMIT_X2_ISR',
		'LIMIT_Y2_ISR',
		'LIMIT_Z2_ISR',
		'LIMIT_A_ISR',
		'LIMIT_B_ISR',
		'LIMIT_C_ISR',
		'PROBE_ISR',
		'ESTOP_ISR',
		'SAFETY_DOOR_ISR',
		'FHOLD_ISR',
		'CS_RES_ISR',
		'DIN0_ISR',
		'DIN1_ISR',
		'DIN2_ISR',
		'DIN3_ISR',
		'DIN4_ISR',
		'DIN5_ISR',
		'DIN6_ISR',
		'DIN7_ISR',
		'PWM0_CHANNEL',
		'PWM1_CHANNEL',
		'PWM2_CHANNEL',
		'PWM3_CHANNEL',
		'PWM4_CHANNEL',
		'PWM5_CHANNEL',
		'PWM6_CHANNEL',
		'PWM7_CHANNEL',
		'PWM8_CHANNEL',
		'PWM9_CHANNEL',
		'PWM10_CHANNEL',
		'PWM11_CHANNEL',
		'PWM12_CHANNEL',
		'PWM13_CHANNEL',
		'PWM14_CHANNEL',
		'PWM15_CHANNEL',
		'PWM0_TIMER',
		'PWM1_TIMER',
		'PWM2_TIMER',
		'PWM3_TIMER',
		'PWM4_TIMER',
		'PWM5_TIMER',
		'PWM6_TIMER',
		'PWM7_TIMER',
		'PWM8_TIMER',
		'PWM9_TIMER',
		'PWM10_TIMER',
		'PWM11_TIMER',
		'PWM12_TIMER',
		'PWM13_TIMER',
		'PWM14_TIMER',
		'PWM15_TIMER',
		'PWM0_MUX',
		'PWM1_MUX',
		'PWM2_MUX',
		'PWM3_MUX',
		'PWM4_MUX',
		'PWM5_MUX',
		'PWM6_MUX',
		'PWM7_MUX',
		'PWM8_MUX',
		'PWM9_MUX',
		'PWM10_MUX',
		'PWM11_MUX',
		'PWM12_MUX',
		'PWM13_MUX',
		'PWM14_MUX',
		'PWM15_MUX',
		'ANALOG0_CHANNEL',
		'ANALOG1_CHANNEL',
		'ANALOG2_CHANNEL',
		'ANALOG3_CHANNEL',
		'ANALOG4_CHANNEL',
		'ANALOG5_CHANNEL',
		'ANALOG6_CHANNEL',
		'ANALOG7_CHANNEL',
		'ANALOG8_CHANNEL',
		'ANALOG9_CHANNEL',
		'ANALOG10_CHANNEL',
		'ANALOG11_CHANNEL',
		'ANALOG12_CHANNEL',
		'ANALOG13_CHANNEL',
		'ANALOG14_CHANNEL',
		'ANALOG15_CHANNEL',
		'ITP_TIMER',
		'RTC_TIMER',
		'SERVO_TIMER',
		'ONESHOT_TIMER',
		'BOARD_NAME'
	];
	download('boardmap_overrides.h', generate_user_config(options, 'BOADMAP_OVERRIDES_H'));
});

document.querySelector('#cnc_hal_overrides').addEventListener('click', function () {
	var options = [
		'ENABLE_SKEW_COMPENSATION',
		'SKEW_COMPENSATION_XY_ONLY',
		'ENABLE_LINACT_PLANNER',
		'ENABLE_LINACT_COLD_START',
		'ENABLE_BACKLASH_COMPENSATION',
		'ENABLE_S_CURVE_ACCELERATION',
		'BRESENHAM_16BIT',
		'ENABLE_EXTRA_SYSTEM_CMDS',
		'RAM_ONLY_SETTINGS',
		'STATUS_AUTOMATIC_REPORT_INTERVAL',
		'LIMIT_X_PULLUP_ENABLE',
		'LIMIT_Y_PULLUP_ENABLE',
		'LIMIT_Z_PULLUP_ENABLE',
		'LIMIT_X2_PULLUP_ENABLE',
		'LIMIT_Y2_PULLUP_ENABLE',
		'LIMIT_Z2_PULLUP_ENABLE',
		'LIMIT_A_PULLUP_ENABLE',
		'LIMIT_B_PULLUP_ENABLE',
		'LIMIT_C_PULLUP_ENABLE',
		'PROBE_PULLUP_ENABLE',
		'ESTOP_PULLUP_ENABLE',
		'SAFETY_DOOR_PULLUP_ENABLE',
		'FHOLD_PULLUP_ENABLE',
		'CS_RES_PULLUP_ENABLE',
		'DISABLE_ALL_LIMITS',
		'DISABLE_PROBE',
		'DISABLE_ALL_CONTROLS',
		'LIMIT_X_DISABLE',
		'LIMIT_Y_DISABLE',
		'LIMIT_Z_DISABLE',
		'LIMIT_X2_DISABLE',
		'LIMIT_Y2_DISABLE',
		'LIMIT_Z2_DISABLE',
		'LIMIT_A_DISABLE',
		'LIMIT_B_DISABLE',
		'LIMIT_C_DISABLE',
		'TOOL1',
		'TOOL2',
		'TOOL3',
		'TOOL4',
		'TOOL5',
		'TOOL6',
		'TOOL7',
		'TOOL8',
		'TOOL9',
		'TOOL10',
		'TOOL11',
		'TOOL12',
		'TOOL13',
		'TOOL14',
		'TOOL15',
		'TOOL16',
		'ENABLE_DUAL_DRIVE_AXIS',
		'DUAL_DRIVE0_AXIS',
		'DUAL_DRIVE0_STEPPER',
		'DUAL_DRIVE0_ENABLE_SELFSQUARING',
		'DUAL_DRIVE1_AXIS',
		'DUAL_DRIVE1_STEPPER',
		'DUAL_DRIVE1_ENABLE_SELFSQUARING',
		'ENABLE_LASER_PPI',
		'LASER_PPI',
		'INVERT_LASER_PPI_LOGIC'
	];
	download('cnc_hal_overrides.h', generate_user_config(options, 'CNC_HAL_OVERRIDES_H'));
});