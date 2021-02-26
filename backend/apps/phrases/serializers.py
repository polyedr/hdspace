import re

from rest_framework import serializers
from apps.phrases.models import DescribedHTML

colorsnames = ['alice blue', 'antique white', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanched almond', 'blue', 'blue violet', 'brown', 'burly wood', 'cadet blue', 'chartreuse', 'chocolate', 'coral', 'cornflower blue', 'cornsilk', 'crimson', 'cyan', 'dark blue', 'dark cyan', 'dark golden rod', 'dark gray', 'dark grey', 'dark green', 'dark khaki', 'dark magenta', 'dark olive green', 'dark orange', 'dark orchid', 'dark red', 'dark salmon', 'dark sea green', 'dark slate blue', 'dark slate gray', 'dark slate grey', 'dark turquoise', 'dark violet', 'deep pink', 'deep sky blue', 'dim gray', 'dim grey', 'dodger blue', 'fire brick', 'floral white', 'forest green', 'fuchsia', 'gainsboro', 'ghost white', 'gold', 'golden rod', 'gray', 'grey', 'green', 'green yellow', 'honey dew', 'hot pink', 'indian red', 'indigo', 'ivory', 'khaki', 'lavender', 'lavender blush', 'lawn green', 'lemon chiffon', 'light blue', 'light coral', 'light cyan', 'light golden rod yellow', 'light gray', 'light grey', 'light green', 'light pink', 'light salmon', 'light sea green', 'light sky blue', 'light slate gray', 'light slate grey', 'light steel blue', 'light yellow', 'lime', 'lime green', 'linen', 'magenta', 'maroon', 'medium aqua marine', 'medium blue', 'medium orchid', 'medium purple', 'medium sea green', 'medium slate blue', 'medium spring green', 'medium turquoise', 'medium violet red', 'midnight blue', 'mint cream', 'misty rose', 'moccasin', 'navajo white', 'navy', 'old lace', 'olive', 'olive drab', 'orange', 'orange red', 'orchid', 'pale golden rod', 'pale green', 'pale turquoise', 'pale violet red', 'papaya whip', 'peach puff', 'peru', 'pink', 'plum', 'powder blue', 'purple', 'rebecca purple', 'red', 'rosy brown', 'royal blue', 'saddle brown', 'salmon', 'sandy brown', 'sea green', 'sea shell', 'sienna', 'silver', 'sky blue', 'slate blue', 'slate gray', 'slate grey', 'snow', 'spring green', 'steel blue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'white smoke', 'yellow', 'yellow green']
colorspattern = '|'.join(colorsnames)
colorregex = re.compile(colorspattern)

# heading, text block, label, container, grid, grid item, column, video, undefined, section
componentsnames = ['frame', 'widget', 'chart', 'image', 'button', 'hyperlink', 'paragraph', 'textbox', 'textarea', 'textinput', 'icon', 'logo', 'unordered list', 'ordered list', 'list item', 'table', 'ocrtext', 'div', 'undefined', 'select', 'label', 'map', 'calendar', 'clock', 'checkbox', 'radiobutton', 'heading', 'text block', 'label', 'container']
componentspattern = '|'.join(componentsnames)
componentregex = re.compile(componentspattern)


class DescribedHTMLSerializer(serializers.ModelSerializer):
    styles = serializers.JSONField()
    parameters = serializers.JSONField()

    class Meta:
        model = DescribedHTML
        fields = ("sentence", "struct_type", "styles", "parameters", "owner")
        extra_kwargs = {"owner": {"read_only": True}, "styles": {"read_only": True}, "parameters": {"read_only": True}}

    def create(self, validated_data):
        sentence = validated_data["sentence"]

        d_html = DescribedHTML(id=None, **validated_data)

        if componentregex.search(sentence):
            d_html.struct_type = '_'.join(componentregex.findall(sentence)[0].split())

        if colorregex.search(sentence):
            d_html.styles["background-color"] = ''.join(colorregex.findall(sentence)[0].split())

        d_html.save()

        return d_html
