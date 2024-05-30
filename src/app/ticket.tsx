import { useState } from "react";
import { StatusBar, Text, View, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagerPicker from "expo-image-picker"

import { useBadgeStore } from "@/store/badge-store"

import { colors } from "@/styles/colors";

import { Credential } from "@/components/credential";
import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { QRCode } from "@/components/qrcode";
import { Redirect } from "expo-router";

export default function Ticket() {
  const [expandQRCode, setExpandQRCode] = useState(false)

  const badgeStore = useBadgeStore()

  async function handleSelectImage() {
    try {
      const result = await ImagerPicker.launchImageLibraryAsync({
        mediaTypes: ImagerPicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      })

      if (result.assets) {
        badgeStore.updateAvatar(result.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
      Alert.alert("Foto", "Não foi possivel selecionar a imagem.")
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="Minha Credencial" />

      <ScrollView 
        className="-mt-28 -z-10" 
        contentContainerClassName="px-8 pb-8" 
        showsHorizontalScrollIndicator={false}
      >
        <Credential 
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage} 
          onExpandQRCode={() => setExpandQRCode(true)}
        />

        <FontAwesome 
          name="angle-double-down"
          size={24}
          color={colors.gray[300]}
          className="self-center my-6"
        />

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar credencial
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você vai participar do evento { badgeStore.data.eventTitle }!
        </Text>

        <Button title="Compartilhar" />

        <TouchableOpacity 
          activeOpacity={0.7} 
          className="mt-10"
          onPress={() => badgeStore.remove()}
        >
          <Text className="text-base text-white font-bold text-center">Remover Ingresso</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={expandQRCode} statusBarTranslucent>
        <View className="flex-1 bg-green-500 items-center justify-center">
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => setExpandQRCode(false)}
          >
            <QRCode value="teste" size={300} />

            <Text className="font-body text-orange-500 text-sm mt-10 text-center">
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}