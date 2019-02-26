

personal_root = "/Users/Victor/Documents/BitBucket Projects/ProjectManagement/apps/virtualize/"


def initiateCocoDetection():
    import os
    ROOT_DIR = os.path.abspath("../")
    import virtualize.mrcnn.model as modellib
    from virtualize.segmentation.new_coco import CocoConfig
    class InferenceConfig(CocoConfig):
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1


    # Root directory of the project
    # MODEL_DIR_WEIGHTS =ROOT_DIR
    MODEL_DIR_WEIGHTS = personal_root + "keras_model"
    # Import Mask RCNN
    # sys.path.append(ROOT_DIR)
    ROOT_DIR = personal_root + "keras_model"

    inference_config = InferenceConfig()

    # Recreate the model in inference mode
    coco_model = modellib.MaskRCNN(mode="inference",
                              config=inference_config,
                              model_dir=MODEL_DIR_WEIGHTS)
    # Get path to saved weights
    # Either set a specific path or find last trained weights
    model_path = os.path.join(ROOT_DIR, "mask_rcnn_coco_all.h5")
    print('model path', model_path)
    # model_path = model.find_last()[1]
    # Load trained weights (fill in path to trained weights here)
    # assert model_path != "", "Provide path to trained weights"
    # print("Loading weights from ", model_path)
    coco_model.load_weights(model_path, by_name=True)
    return coco_model

def cocoTextDetection_model(image_test):
    import skimage
    import numpy as np
    image_test = skimage.color.gray2rgb(np.asarray(image_test))
    # If has an alpha channel, remove it for consistency
    if image_test.shape[-1] == 4:
        image_test = image_test[..., :3]
    # resizing the image
    # rsImage, window, scale, padding, crop = utils.resize_image(
    #         image_test,
    #         min_dim=inference_config.IMAGE_MIN_DIM,
    #         min_scale=inference_config.IMAGE_MIN_SCALE,
    #         max_dim=inference_config.IMAGE_MAX_DIM,
    #         mode=inference_config.IMAGE_RESIZE_MODE)
    results = coco_model.detect([image_test], verbose=0)
    r = results[0]
    return r['rois']

def cocoTextDetection(image_test):
    import os
    ROOT_DIR = os.path.abspath("../")
    import numpy as np
    import virtualize.mrcnn.model as modellib
    import skimage
    # import io
    from virtualize.segmentation.new_coco import CocoConfig
    class InferenceConfig(CocoConfig):
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1

    # Root directory of the project
    # MODEL_DIR_WEIGHTS =ROOT_DIR
    MODEL_DIR_WEIGHTS = personal_root + "keras_model"
    # Import Mask RCNN
    # sys.path.append(ROOT_DIR)
    ROOT_DIR = personal_root + "keras_model"


    inference_config = InferenceConfig()

    # Recreate the model in inference mode
    model = modellib.MaskRCNN(mode="inference",
                              config=inference_config ,
                              model_dir=MODEL_DIR_WEIGHTS )
    # Get path to saved weights
    # Either set a specific path or find last trained weights
    model_path = os.path.join(ROOT_DIR, "mask_rcnn_coco_all.h5")
    print('model path', model_path)
    # model_path = model.find_last()[1]

    # Load trained weights (fill in path to trained weights here)
    # assert model_path != "", "Provide path to trained weights"

    # print("Loading weights from ", model_path)
    model.load_weights(model_path, by_name=True)
    # image_test_path =  "C:/Users/ramitha/Desktop/Adevi/Images/netflix.jpg"
    # image_test = skimage.io.imread(image_test_path)
    # image_test = Image.open(image_test_path)

    # If grayscale. Convert to RGB for consistency.
    # if image_test.ndim != 3:
    image_test = skimage.color.gray2rgb(np.asarray(image_test))
    # If has an alpha channel, remove it for consistency
    if image_test.shape[-1] == 4:
        image_test = image_test[..., :3]
    # resizing the image
    # rsImage, window, scale, padding, crop = utils.resize_image(
    #         image_test,
    #         min_dim=inference_config.IMAGE_MIN_DIM,
    #         min_scale=inference_config.IMAGE_MIN_SCALE,
    #         max_dim=inference_config.IMAGE_MAX_DIM,
    #         mode=inference_config.IMAGE_RESIZE_MODE)
    results = model.detect([image_test], verbose=0)
    r = results[0]
    return r['rois']

def initiateTensorflowDetection():
    import tensorflow as tf
    image_data = []
    label_lines = [line.rstrip() for line
                   in tf.gfile.GFile(
            personal_root + "tf/firstRecognition/retrained_labels.txt")]
    with tf.gfile.FastGFile(
            personal_root + "tf/firstRecognition/retrained_graph.pb",
            'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        _ = tf.import_graph_def(graph_def, name='')
        model_struct=[]
        model_struct.append(tf)
        model_struct.append(label_lines)
    return model_struct


def tensorflowClassDetection_model(prevElemList,tensorflow_model_struct):
    print('Tensorflow')
    print(tensorflow_model_struct)
    tensorflow_model = tensorflow_model_struct[0]
    label_lines = tensorflow_model_struct[1]
    image_data = []
    elemList = [elemT for elemT in prevElemList]
    cnnUpdatedElem = []
    for elementY in elemList:
        image_data.append(tensorflow_model.gfile.FastGFile(elementY.elementRoot, 'rb').read())
    label_lines = [line.rstrip() for line
                   in tensorflow_model.gfile.GFile(
            personal_root + "tf/firstRecognition/retrained_labels.txt")]
    with tensorflow_model.gfile.FastGFile(
            personal_root + "tf/firstRecognition/retrained_graph.pb",
            'rb') as f:
        graph_def = tensorflow_model.GraphDef()
        graph_def.ParseFromString(f.read())
        _ = tensorflow_model.import_graph_def(graph_def, name='')
    with tensorflow_model.Session() as sess:
        certainty = []
        name = []
        elemCNNList = []
        # Feed the image_data as input to the graph and get first prediction
        softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
        elemcount = 0
        # loop all the image data agains the graph model
        for images in range(len(image_data)):
            predictions = sess.run(softmax_tensor, {'DecodeJpeg/contents:0': image_data[images]})
            # Sort to show labels of first prediction in order of confidence
            top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]
            # print('prediction: '+str(predictions))
            # print('top_k: '+str(top_k))
            clusters = []
            nameLoc = []
            valList = []
            classLabelList = []
            tempList = []
            for node_id in top_k:
                human_string = label_lines[node_id]
                score = predictions[0][node_id]
                valList.append(score)
                classLabelList.append(human_string)
                clusters.append('%s (certainty = %.5f)' % (human_string, score))
                nameLoc.append({'cluster': '%s (certainty = %.5f)' % (human_string, score),
                                'score': score,
                                'name': human_string})
                print('Element ' + str(images), '%s (score = %.5f)' % (human_string, score))
            tempList.append(valList)
            tempList.append(classLabelList)
            certainty.append(clusters)
            name.append(nameLoc)
            print('classification val', tempList[0])
            print('classification labels', tempList[1])
            elemCNNList.append(tempList)
            elemJ = elemList[elemcount]
            elemJ.cnnScore = tempList[0][0]
            elemJ.cnnLabel = tempList[1][0]
            elemJ.cnnResult = clusters
            cnnUpdatedElem.append(elemJ)
            elemcount += 1
    return cnnUpdatedElem, elemCNNList

def runCNN(prevElemList):
    import tensorflow as tf
    image_data = []
    elemList = [elemT for elemT in prevElemList]
    cnnUpdatedElem = []
    for elementY in elemList:
        image_data.append(tf.gfile.FastGFile(elementY.elementRoot, 'rb').read())
    label_lines = [line.rstrip() for line
                   in tf.gfile.GFile(
            personal_root + "tf/firstRecognition/retrained_labels.txt")]
    with tf.gfile.FastGFile(
            personal_root + "tf/firstRecognition/retrained_graph.pb",
            'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        _ = tf.import_graph_def(graph_def, name='')
    with tf.Session() as sess:
        certainty = []
        name = []
        elemCNNList = []
        # Feed the image_data as input to the graph and get first prediction
        softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
        elemcount = 0
        # loop all the image data agains the graph model
        for images in range(len(image_data)):
            predictions = sess.run(softmax_tensor, {'DecodeJpeg/contents:0': image_data[images]})
            # Sort to show labels of first prediction in order of confidence
            top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]
            # print('prediction: '+str(predictions))
            # print('top_k: '+str(top_k))

            clusters = []
            nameLoc = []
            valList = []
            classLabelList = []
            tempList = []
            for node_id in top_k:
                human_string = label_lines[node_id]
                score = predictions[0][node_id]
                valList.append(score)
                classLabelList.append(human_string)
                clusters.append('%s (certainty = %.5f)' % (human_string, score))
                nameLoc.append({'cluster': '%s (certainty = %.5f)' % (human_string, score),
                                'score': score,
                                'name': human_string})
                print('Element ' + str(images), '%s (score = %.5f)' % (human_string, score))
            tempList.append(valList)
            tempList.append(classLabelList)
            certainty.append(clusters)
            name.append(nameLoc)
            print('classification val', tempList[0])
            print('classification labels', tempList[1])
            elemCNNList.append(tempList)
            elemJ = elemList[elemcount]
            elemJ.cnnScore = tempList[0][0]
            elemJ.cnnLabel = tempList[1][0]
            elemJ.cnnResult = clusters
            cnnUpdatedElem.append(elemJ)
            elemcount += 1
    return cnnUpdatedElem, elemCNNList
# from matplotlib import pyplot as plt
# import matplotlib.patches as mpatches
# from PIL import Image
# image_test_path =  "C:/Users/ramitha/Desktop/Adevi/Images/netflix.jpg"
# # image_test = skimage.io.imread(image_test_path)
# image_test = Image.open(image_test_path)
# bbox = cocoTextDetection(image_test)
# print('bbox',bbox)
# fig14, ax14 = plt.subplots(figsize=(20, 20))
# colors = 'yellow', 'red', 'blue', 'brown', 'green',
# plt.imshow(image_test)
# plt.title('first_process')
# x = 0
# # parentList =[]
# for elementY in bbox:
#     # tempCNN = elemCNNList[x]
#         # print('score CNN', tempCNN[0])
#         minr, minc, maxr, maxc = elementY
#         print('elementY',elementY)
#         rectx = mpatches.Rectangle((minc, minr), maxc - minc, maxr - minr,
#                                    fill=False, edgecolor=colors[x % 5], linewidth=2, label='LABEL SU')
#         ax14.add_patch(rectx)
#         x += 1
# plt.show()
# print('results',r)
# class_names = ['classname',' ']
# visualize.display_instances(image_test, r['rois'], r['masks'], r['class_ids'],class_names, r['scores'], figsize=(8, 8))
# print('some r[rois] are nuts', r['rois'])
##########
