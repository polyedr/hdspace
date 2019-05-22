from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import sys
import time

import numpy as np
import tensorflow as tf

cnn = {'label': "apps/virtualize/tf/synthethicDataset/retrained_labels.txt",
       'graph': "apps/virtualize/tf/synthethicDataset/retrained_graph.pb"}


def inception(images):

    def load_graph(model_file):
        graph = tf.Graph()
        graph_def = tf.GraphDef()

        with open(model_file, "rb") as f:
          graph_def.ParseFromString(f.read())
        with graph.as_default():
          tf.import_graph_def(graph_def)

        return graph

    def read_tensor_from_image_file(file_name, sess_open, input_height=299, input_width=299,
                      input_mean=0, input_std=255):
        input_name = "file_reader"
        output_name = "normalized"
        file_reader = tf.read_file(file_name, input_name)
        if file_name.endswith(".png"):
          image_reader = tf.image.decode_png(file_reader, channels = 3,
                                             name='png_reader')
        elif file_name.endswith(".gif"):
          image_reader = tf.squeeze(tf.image.decode_gif(file_reader,
                                                        name='gif_reader'))
        elif file_name.endswith(".bmp"):
          image_reader = tf.image.decode_bmp(file_reader, name='bmp_reader')
        else:
          image_reader = tf.image.decode_jpeg(file_reader, channels = 3,
                                              name='jpeg_reader')
        float_caster = tf.cast(image_reader, tf.float32)
        dims_expander = tf.expand_dims(float_caster, 0)
        resized = tf.image.resize_bilinear(dims_expander, [input_height, input_width])
        normalized = tf.divide(tf.subtract(resized, [input_mean]), [input_std])
        result = sess_open.run(normalized)

        return result

    def load_labels(label_file):
        label = []
        proto_as_ascii_lines = tf.gfile.GFile(label_file).readlines()
        for l in proto_as_ascii_lines:
          label.append(l.rstrip())
        return label

    def inception_run():

        file_name = images
        model_file = cnn['graph']
        label_file = cnn['label']
        input_height = 299
        input_width = 299
        input_mean = 0
        input_std = 255
        input_layer = "Mul"
        output_layer = "final_result"

        graph = load_graph(model_file)
        input_name = "import/" + input_layer
        output_name = "import/" + output_layer
        input_operation = graph.get_operation_by_name(input_name)
        output_operation = graph.get_operation_by_name(output_name)

        # start = time.time()
        with tf.Session(graph=graph) as sess:
            sess_open = tf.Session()
            name = []
            for count in range(len(file_name)):
                results = sess.run(
                    output_operation.outputs[0],{
                        input_operation.outputs[0]:read_tensor_from_image_file(
                            file_name[count],
                            sess_open,
                            input_height=input_height,
                            input_width=input_width,
                            input_mean=input_mean,
                            input_std=input_std
                            )
                        }
                    )
                results = np.squeeze(results)
                top_k = results.argsort()[-5:][::-1]
                labels = load_labels(label_file)
                nameLoc = []

                for i in top_k:

                    nameLoc.append({'score': results[i],
                                    'name': labels[i]})
                name.append(nameLoc)
        # end = time.time()
        # print('\nEvaluation time (# of images: '+str(len(file_name))+'): {:.3f}s\n'.format(end-start))
        # print(name)
        return name
    name = inception_run()
    elementNames = [{'cnn': 'Synthethic_CNN', 'results': name}]
    return elementNames




