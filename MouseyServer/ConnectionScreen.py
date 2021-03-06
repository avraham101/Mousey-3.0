import os
from tkinter import Tk, NW, CENTER, E, Frame, Label, Canvas, Button, Listbox, PhotoImage, Scrollbar, filedialog
from Logic import LogicManager

# COLORS
DARK_BLUE = '#0866CC'
DARK_GRAY_BLUE = '#505C67'
GRAY_BLUE = '#A8AEB5'
GRAY = '#626B72'
WHITE_GRAY = "#E7E6E6"
BLUE = '#0B0C60'
WHITE_BLUE = '#9DCCFF'
WHITY_BLUE = '#D7E4F0'
ORANGE = '#FFA240'
DARK_ORANGE = '#B55219'
WHITE = '#FFFFFF'
BLACK = '#000000'

# FONTS
HEADER_FONT = ("Calibri", 36, "bold")
SUB_HEADER_FONT = ("Calibri", 20)
DEVICE_HEADER_FONT = ("Calibri", 14, "bold")
BATTERY_HEADER_FONT = ("Calibri", 12)
BUTTON_FONT = ("Calibri", 16)
SMALL_BUTTON_FONT = ("Calibri", 14)
LISTBOX_HEADER_FONT = ("Calibri", 16)
LISTBOX_FONT = ("Calibri", 10)

def getPhoto(subPath):
    path = os.getcwd()
    path += subPath
    return PhotoImage(file=path)

class Appy:

    def __init__(self):
        self.logicManager = LogicManager.LogicManager()
        self.root = Tk()
        self.rapper_frame = None
        self.initWindow()
        self.initFirstFrame()
        self.connection = None # this is for logout, it is the connection frame
        # self.initConnectedFrame('android')

    def initWindow(self):
        self.root.title('')
        # self.root.resizable(0, 0)
        self.root.geometry("400x600")
        self.root.configure(background=DARK_BLUE)
        self.rapper_frame = Frame(self.root, bg=DARK_BLUE)
        self.rapper_frame.pack(expand="true", fill="both", padx=2, pady=2)

    def initFirstFrame(self):
        logo = LogoFrame(self.rapper_frame)
        def after():
            logo.hideFrame()
            self.initStartFrame()
        logo.setAfterFunc(after)

    def initStartFrame(self):
        start = MenuFrame(self.rapper_frame)
        def connect():
            start.hideFrame()
            self.initSeatchFrame()
        start.setConnectButtonFunction(connect)

    def initSeatchFrame(self):
        search = SearchFrame(self.logicManager, self.rapper_frame)
        self.logicManager.search()
        def back():
            self.logicManager.stopSearch()
            search.hideFrame()
            self.initStartFrame()

        def logout():
            self.connection.hideFrame()
            self.initFirstFrame()

        def connected(connection):
            if self.logicManager.startConnection(connection, logout):
                self.logicManager.stopSearch()
                search.hideFrame()
                self.initConnectedFrame(connection)
            else:  # Todo go here to error frame then back to initSearchFrame
                print('error')
        search.setBackButtonFunction(back)
        search.setConnectionSelectFunction(connected)

    def initConnectedFrame(self, connection):
        self.connection = ConnectedFrame(self.logicManager, self.rapper_frame)
        def logout():
            self.logicManager.stopConnection()
            self.connection.hideFrame()
            self.initFirstFrame()
        self.connection.setLogoutButtonFunction(logout)

    def run(self):
        self.root.mainloop()

class LogoFrame:
    def __init__(self, root):
        self.timeToNextFrame = 1250  # in ms
        self.labelImg = None
        self.img = None
        self.initFrame(root)

    def initFrame(self, root):
        self.img = getPhoto('\\img\\Welcome.png')
        self.labelImg = Label(root, image=self.img)
        self.labelImg['image'] = self.img
        self.labelImg.place(x=0, y=0)
        self.labelImg.pack()

    def hideFrame(self):
        self.labelImg.pack_forget()

    def setAfterFunc(self, afterFunc):
        self.labelImg.after(self.timeToNextFrame, afterFunc)

class MenuFrame:

    def __init__(self, root):
        self.backgroundImg = None
        self.connectImg = None
        self.historyImg = None
        self.initPictures()
        self.frame = None
        self.connect_button = None
        self.initFrame(root)

    def initPictures(self):
        self.backgroundImg = getPhoto('\\img\\LoginScreen.png')
        self.connectImg = getPhoto('\\img\\ConnectButton.png')
        self.historyImg = getPhoto('\\img\\HistoryButton.png')

    def initFrame(self, root):
        self.frame = Canvas(root, bg=DARK_BLUE)
        self.frame.create_image(0, 0, anchor=NW, image=self.backgroundImg)
        self.frame.pack(fill="both")

        start_padx = 45
        end_padx = 60
        pady = (300, 200)
        self.initButtons(self.frame, 0, 0, start_padx, end_padx, pady)

    def initButtons(self, frame, x_grid, y_grid, start_padx, end_padx, pady):
        self.connect_button = Button(frame, image=self.connectImg, bg=GRAY, font=BUTTON_FONT)
        self.connect_button.grid(row=y_grid, column=x_grid, rowspan=2, padx=(start_padx, 0), pady=pady)
        x_grid = x_grid + 1
        logBook_button = Button(frame, image=self.historyImg, bg=GRAY, font=BUTTON_FONT)
        logBook_button.grid(row=y_grid, column=x_grid, rowspan=2, padx=(10, end_padx), pady=pady)

    def setConnectButtonFunction(self, func):
        self.connect_button["command"] = func

    def hideFrame(self):
        self.frame.pack_forget()

class SearchFrame:

    def __init__(self, logicManger, root):
        self.logicManager = logicManger
        # images setup
        self.backgroundImg = None
        self.connectImg = None
        self.backImg = None
        self.initPictures()
        # frame setup
        self.frame = None
        self.clients_list = None
        self.connect_button = None
        self.back_button = None
        self.timeUpdateMobileList = 1000  # in ms
        self.initFrame(root)

    def initPictures(self):
        self.backgroundImg = getPhoto('\\img\\ConnectScreen.png')
        self.connectImg = getPhoto('\\img\\MouseButton.png')
        self.backImg = getPhoto('\\img\\BackButton.png')

    def initFrame(self, root):
        self.frame = Canvas(root, bg=DARK_BLUE)
        self.frame.create_image(0, 0, anchor=NW, image=self.backgroundImg)
        self.frame.pack(expand="true", fill="both")
        padyClients = (200, 0)
        padyButtons = 4
        padx = (35, 0)
        y_grid = 0
        y_grid = self.initClients(self.frame, y_grid, padyClients, padx)
        self.initButtons(self.frame, y_grid, 0, padx, padyButtons)
        self.frame.after(self.timeUpdateMobileList, self.addClient)

    def initClients(self, frame, y_grid, pady, padx):
        rapper_frame = Frame(frame, bg=GRAY_BLUE)
        rapper_frame.grid(row=y_grid, column=0, rowspan=1, columnspan=4, padx=padx, pady=pady)
        label = Label(rapper_frame, text='Select your Smartphone', width=23, font=("Calibri", 14),
                               bg=DARK_GRAY_BLUE, fg=WHITE)
        label.pack(side="top")
        self.clients_list = Listbox(rapper_frame, width=25, height=9, bd=0, font=("Calibri", 12))
        # set the listbox contains func
        self.clients_list.contains = lambda x: x in self.clients_list.get(0, "end")
        self.clients_list.pack(side="left", fill="y", padx=(2, 0), pady=2)
        scrollbar = Scrollbar(rapper_frame, orient="vertical")
        scrollbar.config(command=self.clients_list.yview)
        scrollbar.pack(side="right", fill="y", padx=(0, 2), pady=2)
        self.clients_list.config(yscrollcommand=scrollbar.set)
        return y_grid + 1

    def initButtons(self, frame, y_grid, x_grid, padx, pady):
        self.connect_button = Button(frame, image=self.connectImg, bg=GRAY, font=SMALL_BUTTON_FONT)
        self.connect_button.grid(row=y_grid, column=x_grid, rowspan=1, padx=padx, pady=pady)
        x_grid = x_grid + 3
        self.back_button = Button(frame, image=self.backImg, bg=GRAY, font=SMALL_BUTTON_FONT)
        self.back_button.grid(row=y_grid, column=x_grid, rowspan=1, padx=5, pady=pady)

    def setBackButtonFunction(self, func):
        self.back_button["command"] = func

    def setConnectionSelectFunction(self, func):
        def select():
            index = self.clients_list.curselection()
            connection = self.clients_list.get(index)
            # empty tuple whike return false
            if connection:
                func(connection)
        self.connect_button["command"] = select

    def addClient(self):
        connections = self.logicManager.getConnections()
        for connection in connections.values():
            if not self.clients_list.contains(connection):
                index = self.clients_list.size()
                self.clients_list.insert(index, str(connection))
        self.frame.after(self.timeUpdateMobileList, self.addClient)

    def hideFrame(self):
        self.frame.pack_forget()
        # self.frame.destroy()

class ConnectedFrame:

    def __init__(self, logicManager, root):
        self.logicManger = logicManager
        self.deviceName = self.logicManger.getDeviceName()
        self.battery = self.logicManger.getBattery()
        # images setup
        self.backgroundImg = None
        self.batteryImg = None
        self.logoutImg = None
        self.initPictures()
        # frame setup
        self.frame = None
        self.nameLabel = None
        self.batteryLabel = None
        self.moveLabel = None
        self.files_list = None
        self.logout_button = None
        self.timeUpdate = 1000  # in ms
        self.initFrame(root)

    def initPictures(self):
        self.backgroundImg = getPhoto('\\img\\MainScreen.png')
        self.batteryImg = getPhoto('\\img\\battery.png')
        self.logoutImg = getPhoto('\\img\\LogoutButton.png')

    def initFrame(self, root):
        self.frame = Canvas(root, bg=BLACK)
        self.frame.create_image(0, 0, anchor=NW, image=self.backgroundImg)
        self.frame.pack(expand="true", fill="both")
        y_grid = 1
        x_grid = 0
        pady = (45, 20)
        padx = 20
        y_grid = self.initHeader(self.frame, y_grid, x_grid, pady, padx)
        pady = 0
        y_grid = self.initMainBlock(self.frame, y_grid, x_grid, pady, padx)
        pady = 15
        padx = 10
        self.initButton(self.frame, y_grid, pady, padx)
        self.frame.after(self.timeUpdate, self.updateFrame)

    def initHeader(self, frame, y_grid, x_grid, pady, padx):
        rapper_frame = Frame(frame, bg=WHITE)
        inner_frame = Frame(rapper_frame, bg=DARK_GRAY_BLUE, height=100)
        inner_frame.pack()
        devicename = self.deviceName
        if devicename is not None and len(devicename) > 12:
            devicename = devicename[0:14] + '\n' + devicename[14:]
        self.nameLabel = Label(inner_frame, text=devicename, width=16, font=DEVICE_HEADER_FONT,
                               bg=DARK_GRAY_BLUE, fg=WHITE)
        self.nameLabel.grid(row=0, column=0)
        battery = str(self.battery) + '%   '
        self.batteryLabel = Label(inner_frame, text=battery, width=85, font=BATTERY_HEADER_FONT,
                                  bg=DARK_GRAY_BLUE, image=self.batteryImg, fg=BLACK, compound="center")
        self.batteryLabel.grid(row=0, column=1, padx=(15, 0))
        rapper_frame.grid(row=y_grid, column=x_grid, rowspan=1, columnspan=1, padx=padx, pady=pady)
        return y_grid + 1

    def initMainBlock(self, frame, y_grid, x_grid, pady, padx):
        rapper_frame = Frame(frame, bg=WHITY_BLUE)
        rapper_frame.grid(row=y_grid, column=x_grid, rowspan=1, columnspan=2)
        self.initMouseMovementView(rapper_frame, y_grid, 0, pady, padx)
        self.initFilesView(rapper_frame, y_grid + 1, 0, pady, 0)
        return y_grid + 2

    def initMouseMovementView(self, frame, y_grid, x_grid, pady, padx):
        inner_frame = Frame(frame, bg=WHITY_BLUE)
        inner_frame.grid(row=y_grid, column=x_grid, rowspan=1, columnspan=1, padx=(4, 11))
        label = Label(inner_frame, text='Last Mouse Move:', width=18, font=BATTERY_HEADER_FONT,
                           bg=DARK_GRAY_BLUE, fg=WHITE)
        label.pack(side="left")
        self.moveLabel = Label(inner_frame, text='', width=7, font=BATTERY_HEADER_FONT,
                               bg=WHITY_BLUE, fg=BLACK)
        self.moveLabel.pack(side="right")
        return y_grid + 2

    def initFilesView(self, frame, y_grid, x_grid, pady, padx):
        inner_frame = Frame(frame, bg=BLACK)
        inner_frame.grid(row=y_grid, column=x_grid, rowspan=2, columnspan=2, padx=padx, pady=pady)
        title = Label(inner_frame, text='Recived Files:', width=26, font=BATTERY_HEADER_FONT, bg=DARK_GRAY_BLUE,
                      fg=WHITE)
        title.pack()
        def open(event):
            file = self.files_list.curselection()
            file = self.files_list.get(file)
            self.logicManger.openFile(file)
        self.files_list = Listbox(inner_frame, bd=0, font=LISTBOX_FONT, width=29, height=10)
        self.files_list.pack(side="left", fill="y", padx=(1, 0), pady=1)
        self.files_list.contains = lambda x: x in self.files_list.get(0, "end")
        self.files_list.bind('<Double-1>', open)
        scrollbar = Scrollbar(inner_frame, orient="vertical")
        scrollbar.config(command=self.files_list)
        scrollbar.pack(side="right", fill="y", padx=(0, 2), pady=1)
        self.files_list.config(yscrollcommand=scrollbar.set)
        return y_grid + 2

    def initButton(self, frame, y_grid, pady, padx):
        rapper_frame = Frame(frame, bg=WHITE)
        self.logout_button = Button(rapper_frame, image=self.logoutImg, bg=GRAY, font=SMALL_BUTTON_FONT)
        self.logout_button.pack(anchor=E)
        rapper_frame.grid(row=y_grid, column=0, columnspan=2, pady=pady)

    def setLogoutButtonFunction(self, func):
        self.logout_button["command"] = func

    def hideFrame(self):
        self.frame.pack_forget()

    def updateFrame(self):
        self.getFiles()
        self.getDirection()
        self.getBattery()
        self.frame.after(self.timeUpdate, self.updateFrame)

    def getFiles(self):
        files = self.logicManger.getFiles()
        for file in files:
            if not self.files_list.contains(file):
                name = self.logicManger.getFileName(file)
                arr = name.split('.')
                print('name recived ', name)
                path = filedialog.asksaveasfilename(initialfile=name, filetypes=[(arr[-1], '*.'+arr[-1])])
                arr_p = path.split('/')
                if name != arr_p[-1]:
                    path += '.'+arr[-1]
                self.logicManger.saveFileWithPath(file, path)
                index = self.files_list.size()
                self.files_list.insert(index, file)

    def getDirection(self):
        direction = self.logicManger.getDirection()
        self.moveLabel['text'] = direction

    def getBattery(self):
        battery = self.logicManger.getBattery()
        battery = str(battery) + '%   '
        self.batteryLabel['text'] = battery

# This is the main function
def main():
    app = Appy()
    app.run()


if __name__ == '__main__':
    main()
