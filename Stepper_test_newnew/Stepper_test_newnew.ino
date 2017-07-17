#define gainLimit 20

/*
In the setup there is the Limit Switch while loop will run before the <reset>
If you don't have the limit switches plugged in, uncomment the while loop in the setup.

ASCII Serial Commands
  'A' and then 0-360 no space
  'B' and then 0-360 no space
  for example, A100 or B50
*/

// H-bridge
const int pwmA = 3;
const int in1 = 2;
const int in2 = 4;
const int pwmB = 11;
const int in3 = 7;
const int in4 = 8;

// Switch
const int switchA = A2;
const int switchB = A3;
int resetCheckA = 0;
int resetCheckB = 0;

// Encoder
const int encA = A0;
const int encB = A1;
volatile int goalAposition = 0;
volatile int lastAposition = 0;
volatile int goalBposition = 0;
volatile int lastBposition = 0;
unsigned long lastMilli = 0;

// Encoder
volatile boolean encAPinAtZero = false;
volatile unsigned int encATicks = 0;
volatile boolean encBPinAtZero = false;
volatile unsigned int encBTicks = 0;
volatile boolean runA = false;
volatile boolean runB = false;
volatile boolean runCW = false;
volatile boolean runCCW = false;


//PID
double Kp = 0.6; //0.6
double Ki = 0;
double Kd = 0.3; //0.3;
double errorA = 0;
double lastAerror = 0;
double sumAerror = 0;
double pTermA = 0, iTermA = 0, dTermA = 0;
double driveA = 0;
double errorB = 0;
double lastBerror = 0;
double sumBerror = 0;
double pTermB = 0, iTermB = 0, dTermB = 0;
double driveB = 0;

/*
SETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUP
SETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUP
SETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUPSETUP
*/

void setup() {
  pinMode(pwmA, OUTPUT);
  pinMode(pwmB, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(in3, OUTPUT);
  pinMode(in4, OUTPUT);

  pinMode(encA, INPUT);
  pinMode(encB, INPUT);
  pinMode(switchA, INPUT_PULLUP);
  pinMode(switchB, INPUT_PULLUP);

  //pwm frequnecy setup (http://playground.arduino.cc/Code/PwmFrequency)
  TCCR2B = TCCR2B & 0b11111000 | 0x07; // 30 (30) Hz pin 3 and 11

  // encoder read interrupt setup
  cli(); // switch interrupts off while messing with their settings

  PCICR =0x02; // Enable PCINT1 interrupt
  PCMSK1 = 0b00000011; // mask A0 and A1
  sei(); // switch back on

   // Initial motor setup
  analogWrite(pwmA, 0); //(25% = 64; 50% = 127; 75% = 191; 100% = 255)
  analogWrite(pwmB, 0);
  digitalWrite(in1, LOW);
  digitalWrite(in2, HIGH);
  digitalWrite(in3, LOW);
  digitalWrite(in4, HIGH);
  
  

  //N.O = GND, I.O = A2 and A3
  /*Limit switch while loopLimit switch while loopLimit switch while loopLimit switch while loopLimit switch while loopLimit switch while loopLimit switch while loop
    Limit switch while loopLimit switch while loopLimit switch while loopLimit switch while loopLimit switch while loopLimit switch while loopLimit switch while loop
 
  Limit switch while loop
  Comment out this while loop if limit switches are not plugged in or else you can't test the servo motors.
  The switches are using normally open (NO) and are plugged into A2 and A3 in the MALG board
  */
  /*
  while(resetCheckA == 0 || resetCheckB == 0) {
    if(debounce(switchA)==LOW) {
      motorAstop();
      resetCheckA = 1;
      encATicks = 0;
    }
    if(debounce(switchB)==LOW) {
      motorBstop();
      resetCheckB = 1;
      encBTicks = 0;
    }
  }
  */
  Serial.begin(115200);
  Serial.println("<reset>"); 
}

int debounce(int pin) {
  int state, prevState;
  prevState = digitalRead(pin);
  for(int i=0; i<25; i++) {
    delay(1);
    state = digitalRead(pin);
    if(state != prevState) {
        i = 0;
        prevState = state;
    }
  }
  return state;
}

int updateAPid(int targetposition, int currentposition) {
  errorA = targetposition - currentposition;
  pTermA = Kp*errorA;
  sumAerror += errorA;
  iTermA = Ki*constrain(sumAerror, -gainLimit, gainLimit);
  dTermA = Kd*(errorA - lastAerror);
  lastAerror = errorA;
  return constrain((pTermA+iTermA+dTermA), -255, 255);
}

void motorAmove(int PWM_val) {
  PWM_val = abs(PWM_val);
  if (PWM_val < 35) PWM_val = 35;
  if(goalAposition > lastAposition) {
       runCW = true;
       runCCW = false;
       analogWrite(pwmA, PWM_val);
       digitalWrite(in1, LOW);
       digitalWrite(in2, HIGH);
  }

  else if(goalAposition < lastAposition) {
     runCW = false;
     runCCW = true;
     analogWrite(pwmA, PWM_val);
     digitalWrite(in1, HIGH);
     digitalWrite(in2, LOW);;
  }
}

int updateBPid(int targetposition, int currentposition) {
  errorB = targetposition - currentposition;
  pTermB = Kp*errorB;
  sumBerror += errorB;
  iTermB = Ki*constrain(sumBerror, -gainLimit, gainLimit);
  dTermB = Kd*(errorB - lastBerror);
  lastBerror = errorB;
  return constrain((pTermB+iTermB+dTermB), -255, 255);
}

void motorBmove(int PWM_val) {
 PWM_val = abs(PWM_val);
 if (PWM_val < 35) PWM_val = 35;
 if(goalBposition > lastBposition) {
     runCW = true;
     runCCW = false;
     analogWrite(pwmB, PWM_val);
     digitalWrite(in3, LOW);
     digitalWrite(in4, HIGH);
 }

 else if(goalBposition < lastBposition) {
     runCW = false;
     runCCW = true;
     analogWrite(pwmB, PWM_val);
     digitalWrite(in3, HIGH);
     digitalWrite(in4, LOW);
 }
}

void motorAstop() {
  analogWrite(pwmA, 0);
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);
  delay(190);
  lastAposition = encATicks;
}

void motorBstop() {
  analogWrite(pwmB, 0);
  digitalWrite(in3, LOW);
  digitalWrite(in4, LOW);
  delay(100);
  lastBposition = encBTicks;
}

/*
COMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDS
COMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDSCOMMANDS
*/
int getCmd() {
  char cmd;
  int inputPosition;
  if(!Serial.available()) return 0;
  delay(10);
  Serial.print("Type in command :");
  cmd = Serial.read();
  Serial.println(cmd);
  if(!Serial.available()) return 0;
  Serial.print("Type in input :");
  inputPosition = Serial.parseInt();
  Serial.println(inputPosition, DEC);
  Serial.flush();

  switch (cmd) {
    case 'A':
    case 'a':
        if(inputPosition >= 0 && inputPosition <= 360) {
            runA = true;
            runB = false;
            inputPosition = inputPosition/2;
            goalAposition = inputPosition;
        }
        else {
            Serial.println("Input out of range");
        }
        break;
    case 'B':
    case 'b':
        if(inputPosition >= 0 && inputPosition <= 360) {
            runB = true;
            runA = false;
            inputPosition = inputPosition/2;
            goalBposition = inputPosition;
        }
        else {
            Serial.println("Input out of range");
        }
        break;     
    case 'S':
    case 's':
        motorAstop();
        motorAstop();
        motorBstop();
        motorBstop();
        Serial.println("YOU WANT TO STOP");
        break;  
    case 'X':
    case 'x':
        Serial.println("THIS SHOULD BE MALG ID");
        break; 
  default:
        Serial.println("???");
  }
}

ISR(PCINT1_vect) {
    int m = digitalRead(encA);
    if (m == LOW) encAPinAtZero = true;
    else {
      if(encAPinAtZero) { 
        encAPinAtZero = false;
        if(runCW) {
            encATicks++; 
        }
        else if(runCCW) {
            encATicks--;
        }
      }
    }
    
    int n = digitalRead(encB);
    if (n == LOW) encBPinAtZero = true;  
    else {
      if(encBPinAtZero) {
        encBPinAtZero = false;
        if(runCW) {
            encBTicks++;
        }
        else if(runCCW) {
            encBTicks--;
        }
      }
    }
}

void loop() {
  getCmd();
  if((millis()-lastMilli) >= 0) {
    lastMilli = millis();
    if(runA) {
      driveA = updateAPid(goalAposition, lastAposition); 
      motorAmove(driveA);
      if(goalAposition == encATicks) motorAstop();

    }
    if(runB) {
      driveB = updateBPid(goalBposition, lastBposition);
      motorBmove(driveB);
      if(goalBposition == encBTicks) motorBstop();
    }
  }
}
