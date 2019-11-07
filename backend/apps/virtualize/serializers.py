import pymongo
from PIL import Image
from rest_framework import serializers

from django.db import connection

from apps.projects.models import ScenarioElement, ScreenScenario

from apps.virtualize.utils.metaCustomUtils import *

client = pymongo.MongoClient("localhost", 27017)  # maxPoolSize=50
db = client.MeduzaDb
# TODO: Check, do we really need to use pymongo here
main_db_name = connection.settings_dict['NAME']
db_main = client[main_db_name]


class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "scenario",
            "name",
            "struct_type",
            "func_type",
            "func_type_human",
            "buoyancy",
            "parameters",
            "styles",
        )


class ScreenScenarioSerializer(serializers.ModelSerializer):
    # elements = ScenarioElementSerializer(many=True, read_only=True)
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScreenScenario
        fields = (
            "id",
            "screen",
            "name",
            "parent_id",
            "type",
            "direction",
            "buoyancy",
            "elements",
            "parameters",
            "styles",
            # "screenscenario"
        )
        extra_kwargs = {"elements": {"read_only": True}}
        # fields = "__all__"

    def create(self, validated_data):
        project_id = db_main.projects_projectscreen.find_one(
            {"id": validated_data["screen"].id}
        )["project_id"]
        # They can be multiple, so, should process them as 1:1
        screenshot_id = db_main.projects_project.find({"id": project_id})[0][
            "screenshots"
        ][0]
        screenshot_id_querying = ObjectId(screenshot_id)

        myFile = ""
        master_id_collection = db.screenshots.find({"_id": ObjectId(screenshot_id)})

        for id in master_id_collection:
            print("id", id)
            myFile = id["image"]

        # Obtained from metaCustom.py
        with Image.open("media/" + str(myFile)) as img:
            widthScreen, heightScreen = img.size

        ButtonArray = get_collection(db.buttons, screenshot_id)
        textBoxArray = get_collection(db.textBoxes, screenshot_id)
        textAreaArray = get_collection(db.textArea, screenshot_id)
        hyperLinkArray = get_collection(db.hyperLinks, screenshot_id)
        paragraphArray = get_collection(db.paragraphs, screenshot_id)
        frameArray = get_collection(db.frames, screenshot_id)
        pictureArray = get_collection(db.pictures, screenshot_id)
        newElementsArray = get_collection(db.newElements, screenshot_id)
        widgetArray = get_collection(db.widgets, screenshot_id)
        calendarWidgetsArray = get_collection(db.calendarWidgets, screenshot_id)
        barChartArray = get_collection(db.barChart, screenshot_id)
        iconArray = get_collection(db.icon, screenshot_id)
        logoArray = get_collection(db.logo, screenshot_id)

        # Obtaining the backgrounds array for the scenario styles
        backgroundsArray = db.backgrounds.find({"screenshot_id": screenshot_id})

        """
        Describe the scenario data
        """
        # Background styles property
        scenario_data_styles_background = ""
        for document in backgroundsArray:
            scenario_data_styles_background += document["background"]
        scenario_data = {
            "name": "string1",
            "type": "login",
            "struct_type": "scenario",
            "parameters": {},
            "styles": {"background": scenario_data_styles_background},
        }

        """
        Scenarioelements for the current scenario.
        These elements relate to the MeduzaDb collections
        Pictures, textboxes and paragraphs are the first array to check.
        """
        scenarioelements = []

        # Button array to elements.
        element_button = {}
        for document in ButtonArray:
            element_button["name"] = "button"
            element_button["struct_type"] = "button"
            element_button["func_type"] = "end_composite_scenario"
            element_button["func_type_human"] = "undefined"
            element_button["buoyancy"] = 1
            element_button["parameters"] = {
                "content": document["name"],
                "location": document["location"],
            }
            # Obtaining the button styles from the segmentation
            seg_id = document["seg_id"]
            element_styles = db.styles.find({"segmentation_id": seg_id})
            element_button_style = {}
            for element_style in element_styles:
                element_button_style = {
                    "font-family": element_style["fontFamily"],
                    "font-size": element_style["fontSize"],
                    "color": element_style["fontColor"],
                    "border-color": element_style["borderColor"],
                    "background": element_style["background-gradient"],
                    "border-radius": element_style["borderRadius"],
                    "background-color": element_style["bgcolor"],
                    "box-shadow": element_style["boxShadow"],
                    "text-align": element_style["textAlign"],
                    "text-indent": element_style["textIndent"],
                    "text-shadow": element_style["textShadow"],
                    "animation-type": element_style["animationType"],
                    "z-index": element_style["zIndex"],
                }

            element_button["styles"] = element_button_style

        scenarioelements.append(element_button)

        # Hyperlink array to elements.
        element_hyperlink = {}
        for document in hyperLinkArray:
            element_hyperlink["name"] = "hyperlink"
            element_hyperlink["struct_type"] = "hyperlink"
            element_hyperlink["func_type"] = "end simple scenario"
            element_hyperlink["func_type_human"] = "undefined"
            element_hyperlink["buoyancy"] = 2
            element_hyperlink["parameters"] = {
                "content": document["name"],
                "location": document["location"],
            }
            # Obtaining the hyperlink styles from the segmentation
            seg_id = document["seg_id"]
            element_styles = db.styles.find({"segmentation_id": seg_id})
            element_hyperlink_style = {}
            for element_style in element_styles:
                element_hyperlink_style = {
                    "font-family": element_style["fontFamily"],
                    "font-size": element_style["fontSize"],
                    "color": element_style["fontColor"],
                    "border-color": element_style["borderColor"],
                    "background": element_style["background-gradient"],
                    "border-radius": element_style["borderRadius"],
                    "background-color": element_style["bgcolor"],
                    "box-shadow": element_style["boxShadow"],
                    "text-align": element_style["textAlign"],
                    "text-indent": element_style["textIndent"],
                    "text-shadow": element_style["textShadow"],
                    "animation-type": element_style["animationType"],
                    "z-index": element_style["zIndex"],
                }

            element_hyperlink["styles"] = element_hyperlink_style

        scenarioelements.append(element_hyperlink)

        # Paragraph array to elements. 1_v.jpg
        element_paragraph = {}
        for document in paragraphArray:
            element_paragraph["name"] = "paragraph"
            element_paragraph["struct_type"] = "text"
            element_paragraph["func_type"] = "description"
            element_paragraph["func_type_human"] = "undefined"
            element_paragraph["buoyancy"] = 98
            element_paragraph["parameters"] = {
                "content": document["name"],
                "location": document["location"],
            }
            # Obtaining the paragraph styles from the segmentation
            seg_id = document["seg_id"]
            element_styles = db.styles.find({"segmentation_id": seg_id})
            element_paragraph_style = {}
            for element_style in element_styles:
                element_paragraph_style = {
                    "font-family": element_style["fontFamily"],
                    "font-size": element_style["fontSize"],
                    "color": element_style["fontColor"],
                    "border-color": element_style["borderColor"],
                    "background": element_style["background-gradient"],
                    "border-radius": element_style["borderRadius"],
                    "background-color": element_style["bgcolor"],
                    "box-shadow": element_style["boxShadow"],
                    "text-align": element_style["textAlign"],
                    "text-indent": element_style["textIndent"],
                    "text-shadow": element_style["textShadow"],
                    "animation-type": element_style["animationType"],
                    "z-index": element_style["zIndex"],
                }

            element_paragraph["styles"] = element_paragraph_style

        scenarioelements.append(element_paragraph)

        # Pictures array to elements. 1_v.jpg
        element_picture = {}
        for document in pictureArray:
            element_picture["name"] = "picture"
            element_picture["struct_type"] = "image"
            element_picture["func_type"] = "undefined"
            element_picture["func_type_human"] = "undefined"
            # This value was placed by random choice
            element_picture["buoyancy"] = 78
            element_picture["parameters"] = {
                "src": document["root"],
                "alt": document["name"],
                "location": document["location"],
            }
            # Obtaining the picture styles from the segmentation
            seg_id = document["seg_id"]
            element_styles = db.styles.find({"segmentation_id": seg_id})
            element_picture_style = {}
            for element_style in element_styles:
                element_picture_style = {
                    "font-family": element_style["fontFamily"],
                    "font-size": element_style["fontSize"],
                    "color": element_style["fontColor"],
                    "border-color": element_style["borderColor"],
                    "background": element_style["background-gradient"],
                    "border-radius": element_style["borderRadius"],
                    "background-color": element_style["bgcolor"],
                    "box-shadow": element_style["boxShadow"],
                    "text-align": element_style["textAlign"],
                    "text-indent": element_style["textIndent"],
                    "text-shadow": element_style["textShadow"],
                    "animation-type": element_style["animationType"],
                    "z-index": element_style["zIndex"],
                }

            element_picture["styles"] = element_picture_style

        scenarioelements.append(element_picture)

        # Textbox array to elements. 1_v.jpg
        element_textbox = {}
        for document in textBoxArray:
            # Convert float height and width first to float and second to int. Finally the 'px' was added
            element_textbox_width = (
                str(int(document["location"]["x1"] - document["location"]["x0"])) + "px"
            )
            element_textbox_height = (
                str(int(document["location"]["y1"] - document["location"]["y0"])) + "px"
            )
            element_textbox["name"] = "textbox"
            element_textbox["struct_type"] = "input"
            # Functional type should be detected in extra with OCR coordination
            element_textbox["func_type"] = "undefined"
            element_textbox["func_type_human"] = "undefined"
            # The buoyancy should be corrected based on functional type
            element_textbox["buoyancy"] = 50
            # The source is an image
            element_textbox["parameters"] = {
                "source": document["root"],
                "placeohlder": document["name"],
                "location": document["location"],
            }
            # Obtaining the textbox styles from the segmentation
            seg_id = document["seg_id"]
            element_styles = db.styles.find({"segmentation_id": seg_id})
            element_textbox_style = {}
            for element_style in element_styles:
                element_textbox_style = {
                    "font-family": element_style["fontFamily"],
                    "font-size": element_style["fontSize"],
                    "color": element_style["fontColor"],
                    "border-color": element_style["borderColor"],
                    "background": element_style["background-gradient"],
                    "border-radius": element_style["borderRadius"],
                    "background-color": element_style["bgcolor"],
                    "box-shadow": element_style["boxShadow"],
                    "text-align": element_style["textAlign"],
                    "text-indent": element_style["textIndent"],
                    "text-shadow": element_style["textShadow"],
                    "animation-type": element_style["animationType"],
                    "z-index": element_style["zIndex"],
                    # Width and height are custom for the textbox
                    "width": element_textbox_width,
                    "height": element_textbox_height,
                }

            element_textbox["styles"] = element_textbox_style

            """Get children for the documents and detect the functional class based on them"""
            # Should adapt this code further
            """
            children = document.next().children
            name = []
            for child in children:
                name.append(child["name"])
            # Detect the functional class
            # Lowercase to further comparison
            name = [x.lower() for x in name]
            if 'user' in str(name):
                element_textbox["func_type"] = "username"
            if 'phone' in str(name):
                element_textbox["func_type"] = "phone"
            if 'password' in str(name):
                element_textbox["func_type"] = "password"
            if 'first' in str(name):
                element_textbox["func_type"] = "firstname"
            if 'last' in str(name):
                element_textbox["func_type"] = "lastname"
            if 'email' in str(name):
                element_textbox["func_type"] = "email"
            """
        scenarioelements.append(element_textbox)

        screen = validated_data["screen"]

        scenario = ScreenScenario.objects.create(screen=screen, **scenario_data)

        for scenarioelement_data in scenarioelements:
            ScenarioElement.objects.create(scenario=scenario, **scenarioelement_data)

        return scenario
