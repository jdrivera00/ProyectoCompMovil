import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Inicio",
        }}
      />
      <Drawer.Screen
        name="BotonAdmin"
        options={{
          drawerLabel: "Soy administrador",
        }}
      />
      <Drawer.Screen name="(auth)" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="(tabs)" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="+not-found" options={{ drawerItemStyle: { display: "none" } }} />
    </Drawer>
  );
}
