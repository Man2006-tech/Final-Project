package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.LostAndFound.*;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lostandfound")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LostAndFoundController {

    private final LostAndFoundService lostAndFoundService;
    private final ProfileService profileService;

    // ==================== LOST ITEMS ====================
    @PostMapping("/lost")
    public ResponseEntity<LostItemResponseDTO> reportLostItem(
            @RequestParam Long userId,
            @Valid @RequestBody CreateLostItemRequestDTO request) {
        LostItem lostItem = LostItem.builder()
                .itemName(request.getItemName())
                .description(request.getDescription())
                .locationLost(request.getLocationLost())
                .dateLost(request.getDateLost())
                .contactInfo(request.getContactInfo())
                .imageUrl(request.getImageUrl())
                .build();

        LostItem created = lostAndFoundService.reportLostItem(userId, lostItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToLostItemResponseDTO(created));
    }

    @GetMapping("/lost/{itemId}")
    public ResponseEntity<LostItemResponseDTO> getLostItemById(@PathVariable Long itemId) {
        LostItem item = lostAndFoundService.getLostItemById(itemId);
        return ResponseEntity.ok(mapToLostItemResponseDTO(item));
    }

    @GetMapping("/lost")
    public ResponseEntity<List<LostItemResponseDTO>> getAllLostItems() {
        List<LostItem> items = lostAndFoundService.getAllLostItems();
        return ResponseEntity.ok(items.stream().map(this::mapToLostItemResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/lost/search")
    public ResponseEntity<List<LostItemResponseDTO>> searchLostItems(@RequestParam String keyword) {
        List<LostItem> items = lostAndFoundService.searchLostItems(keyword);
        return ResponseEntity.ok(items.stream().map(this::mapToLostItemResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/lost/user/{userId}")
    public ResponseEntity<List<LostItemResponseDTO>> getUserLostItems(@PathVariable Long userId) {
        List<LostItem> items = lostAndFoundService.getLostItemsByUser(userId);
        return ResponseEntity.ok(items.stream().map(this::mapToLostItemResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/lost/{itemId}/mark-found")
    public ResponseEntity<LostItemResponseDTO> markLostItemAsFound(@PathVariable Long itemId) {
        LostItem item = lostAndFoundService.markLostItemAsFound(itemId);
        return ResponseEntity.ok(mapToLostItemResponseDTO(item));
    }

    @DeleteMapping("/lost/{itemId}")
    public ResponseEntity<String> deleteLostItem(@PathVariable Long itemId) {
        lostAndFoundService.deleteLostItem(itemId);
        return ResponseEntity.ok("Lost item deleted successfully");
    }

    // ==================== FOUND ITEMS ====================
    @PostMapping("/found")
    public ResponseEntity<FoundItemResponseDTO> reportFoundItem(
            @RequestParam Long userId,
            @Valid @RequestBody CreateFoundItemRequestDTO request) {
        FoundItem foundItem = FoundItem.builder()
                .itemName(request.getItemName())
                .description(request.getDescription())
                .locationFound(request.getLocationFound())
                .dateFound(request.getDateFound())
                .contactInfo(request.getContactInfo())
                .imageUrl(request.getImageUrl())
                .build();

        FoundItem created = lostAndFoundService.reportFoundItem(userId, foundItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToFoundItemResponseDTO(created));
    }

    @GetMapping("/found/{itemId}")
    public ResponseEntity<FoundItemResponseDTO> getFoundItemById(@PathVariable Long itemId) {
        FoundItem item = lostAndFoundService.getFoundItemById(itemId);
        return ResponseEntity.ok(mapToFoundItemResponseDTO(item));
    }

    @GetMapping("/found")
    public ResponseEntity<List<FoundItemResponseDTO>> getAllFoundItems() {
        List<FoundItem> items = lostAndFoundService.getAllFoundItems();
        return ResponseEntity.ok(items.stream().map(this::mapToFoundItemResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/found/search")
    public ResponseEntity<List<FoundItemResponseDTO>> searchFoundItems(@RequestParam String keyword) {
        List<FoundItem> items = lostAndFoundService.searchFoundItems(keyword);
        return ResponseEntity.ok(items.stream().map(this::mapToFoundItemResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/found/user/{userId}")
    public ResponseEntity<List<FoundItemResponseDTO>> getUserFoundItems(@PathVariable Long userId) {
        List<FoundItem> items = lostAndFoundService.getFoundItemsByUser(userId);
        return ResponseEntity.ok(items.stream().map(this::mapToFoundItemResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/found/{itemId}/claim")
    public ResponseEntity<FoundItemResponseDTO> claimFoundItem(
            @PathVariable Long itemId,
            @RequestParam Long claimerId) {
        FoundItem item = lostAndFoundService.markFoundItemAsClaimed(itemId, claimerId);
        return ResponseEntity.ok(mapToFoundItemResponseDTO(item));
    }

    @DeleteMapping("/found/{itemId}")
    public ResponseEntity<String> deleteFoundItem(@PathVariable Long itemId) {
        lostAndFoundService.deleteFoundItem(itemId);
        return ResponseEntity.ok("Found item deleted successfully");
    }

    // ==================== MAPPERS ====================
    private LostItemResponseDTO mapToLostItemResponseDTO(LostItem item) {
        return LostItemResponseDTO.builder()
                .id(item.getId())
                .itemName(item.getItemName())
                .description(item.getDescription())
                .locationLost(item.getLocationLost())
                .dateLost(item.getDateLost())
                .reportedBy(mapToUserSummaryDTO(item.getReportedBy()))
                .contactInfo(item.getContactInfo())
                .imageUrl(item.getImageUrl())
                .isFound(item.getIsFound())
                .status(item.getStatus())
                .createdAt(item.getCreatedAt())
                .build();
    }

    private FoundItemResponseDTO mapToFoundItemResponseDTO(FoundItem item) {
        return FoundItemResponseDTO.builder()
                .id(item.getId())
                .itemName(item.getItemName())
                .description(item.getDescription())
                .locationFound(item.getLocationFound())
                .dateFound(item.getDateFound())
                .foundBy(mapToUserSummaryDTO(item.getFoundBy()))
                .contactInfo(item.getContactInfo())
                .imageUrl(item.getImageUrl())
                .isClaimed(item.getIsClaimed())
                .claimedBy(item.getClaimedBy() != null ? mapToUserSummaryDTO(item.getClaimedBy()) : null)
                .status(item.getStatus())
                .createdAt(item.getCreatedAt())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try {
            Profile profile = profileService.getProfileByUserId(user.getUserId());
            profilePicture = profile.getProfilePicture();
        } catch (Exception e) {}
        return UserSummaryDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .profilePicture(profilePicture)
                .department(user.getDepartment())
                .build();
    }
}