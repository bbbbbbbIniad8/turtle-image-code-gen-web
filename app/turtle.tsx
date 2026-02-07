const turtle_code_first = (data: string[], size: number[])=>{
    const code = 
`
import turtle
import math

class TurtlePrint:
    def __init__(self, image_data, scale):
        self.first_pos = turtle.pos()
        self.image_data = image_data["image_data"]
        self.width, self.height = image_data["size"]
        self.pensize = scale

    def turtle_prepare(self):
        turtle.speed('fastest')
        turtle.pensize(self.pensize)
        turtle.penup()
        theta_rad = math.atan(self.height/self.width)
        theta_deg = math.degrees(theta_rad)
        turtle.left(180-theta_deg)
        turtle.forward(((self.width/2)**2 + (self.height/2)**2)**(1/2) * self.pensize)
        turtle.left(theta_deg)
        turtle.forward(self.pensize)
        turtle.left(180)
        turtle.pendown()

    def turtle_move_nextline(self):
        turtle.penup()
        turtle.left(-90)
        turtle.forward(self.pensize)
        turtle.left(-90)
        turtle.forward(self.width*self.pensize)
        turtle.left(-180)
        turtle.pendown()

    def turtle_return(self):
        turtle.penup()
        turtle.goto(self.first_pos)
        turtle.forward((self.width*self.pensize)/2)
        turtle.pendown()

    def run(self):
        self.turtle_prepare()
        for count, element in enumerate(self.image_data):
            if count != 0 and count % self.width == 0:
                self.turtle_move_nextline()
            turtle.pencolor(element)
            turtle.forward(self.pensize)
        self.turtle_return()

image = {"image_data": [${data}],
        "size": [${size}]}
`
    return code
  
  }

const turtle_code_second = (pensize: number) =>{
    const code = `

turtle.tracer(False)
TurtlePrint(image, ${pensize}).run()
turtle.tracer(True)
`
    return code
}

const union_code = (first_code: string, second_code: string)=>{
    return first_code + second_code
}


export {turtle_code_first, turtle_code_second, union_code}