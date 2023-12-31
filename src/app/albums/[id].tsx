import Image from "next/image";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { SPOTIFY_API_URL } from "@/utils/spotifyConfig";
import { getSpotifyAccessToken } from "@/utils/spotifyAuth";

interface ArtistPageProps {
  artistName: string;
  albums: Array<{ name: string; release_date: string }>;
}

const Home: React.FC<ArtistPageProps> = ({ artistName, albums }) => {
  return (
    <main className="flex h-screen w-screen min-h-screen min-w-screen flex-col">
      <Navbar />
      <div className="w-screen flex flex-col gap-5 items-center justify-center mt-32">
        <h1 className="text-3xl w-[800px] font-semibold text-center">
          Qual artista você deseja ver os lançamentos?
        </h1>
        <div>
          <div className="w-[650px]  flex items-center space-x-2">
            <Input
              type="text"
              className="h-10"
              placeholder="Qual o artista que você vai querer ver os lancamentos?"
            />
            <Button type="submit" className="h-10">
              Pesquisar
            </Button>
          </div>
        </div>
      </div>
      <div className="w-screen flex flex-col items-center justify-center mt-32">
        <div className="flex w-[800px] text-muted-foreground items-center gap-2">
          <Clock />
          <h1 className="font-semibold text-start">Pesquisas Anteriores</h1>
        </div>
      </div>
      <div className="-z-10 bg-primary/10 absolute -top-2/4 left-1/2 -translate-x-[50%] w-[1080px] h-[720px] rounded-full blur-3xl"></div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params;

  try {
    const accessToken = await getSpotifyAccessToken();

    const artistResponse = await axios.get(`${SPOTIFY_API_URL}/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const artistName = artistResponse.data.name;

    const albumsResponse = await axios.get(
      `${SPOTIFY_API_URL}/artists/${id}/albums`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          include_groups: "album",
        },
      }
    );

    const albums = albumsResponse.data.items.map((album: any) => ({
      name: album.name,
      release_date: album.release_date,
    }));

    return {
      props: {
        artistName,
        albums,
      },
    };
  } catch (error) {
    console.error("Erro ao obter dados do Spotify:", error);
    return {
      notFound: true,
    };
  }
};

export default Home;
